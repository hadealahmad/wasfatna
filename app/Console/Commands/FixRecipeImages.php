<?php

namespace App\Console\Commands;

use App\Models\Recipe;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Carbon\Carbon;

class FixRecipeImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:recipe-images {--dry-run : Run without making changes} {--path= : Path to the folder containing orphaned images} {--offset=0 : Timezone offset in minutes (add this to file time to match DB)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Match orphaned recipe images to recipes based on creation time and convert to WebP';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $sourcePath = $this->option('path') ?: storage_path('app/public/recipes');

        if (!File::exists($sourcePath)) {
            $this->error("Directory not found: $sourcePath");
            return;
        }

        $this->info("Scanning directory: $sourcePath");
        $files = File::files($sourcePath);
        
        $matched = 0;
        $skipped = 0;
        $errors = 0;

        $assignedRecipeIds = [];

        foreach ($files as $file) {
            $extension = strtolower($file->getExtension());
            if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                continue;
            }

            $filename = $file->getFilename();
            // Ignore already correct UUID-like webp files if we were scanning them (but we filter extensions above)
            if ($extension === 'webp') continue;

            $mtime = $file->getMTime();
            $fileDate = Carbon::createFromTimestamp($mtime);
            
            $this->line("Processing $filename (Modified: {$fileDate->toDateTimeString()})");

            // Look for recipes created within +/- 2 minutes of this timestamp
            // adjusting for timezone if necessary? Usually created_at is UTC. 
            // filemtime is unix timestamp (UTC-ish). 
            // Let's assume server time and file time are consistent.
            
            $offsetMinutes = (int) $this->option('offset');
            $searchDate = $fileDate->clone()->addMinutes($offsetMinutes);

            // Look for recipes created within +/- 2 minutes of the (adjusted) file timestamp
            $windowMinutes = 5; // Increased slightly to 5 mins to be safe
            $recipes = Recipe::whereBetween('created_at', [
                $searchDate->clone()->subMinutes($windowMinutes),
                $searchDate->clone()->addMinutes($windowMinutes)
            ])
            ->whereNotIn('id', $assignedRecipeIds)
            ->get();

            if ($recipes->isEmpty()) {
                 $this->warn("  [SKIPPED] No matching recipe found for {$filename}. (File: {$fileDate}, Search: {$searchDate})");
                 $skipped++;
                 continue;
            }

            if ($recipes->count() > 1) {
                // Find the closest one
                $sorted = $recipes->sortBy(function($recipe) use ($searchDate) {
                    return abs($recipe->created_at->diffInSeconds($searchDate));
                });
                
                $bestMatch = $sorted->first();
                $diff = abs($bestMatch->created_at->diffInSeconds($searchDate));
                
                // If the closest is still "too far" relative to others? No, just pick closest.
                // But if we have two identical times, it's still ambiguous.
                // Secondary sort by ID?
                if ($sorted->count() > 1) {
                     $secondBest = $sorted->get(1);
                     if (abs($secondBest->created_at->diffInSeconds($searchDate)) == $diff) {
                         $this->warn("  [SKIPPED] Multiple recipes found for {$filename} with SAME closest time difference ($diff s). Ambiguous.");
                         $skipped++;
                         continue;
                     }
                }
                
                $recipe = $bestMatch;
                $this->info("  [MATCH] Found closest recipe (diff {$diff}s): {$recipe->name}");
            } else {
                $recipe = $recipes->first();
                $diff = abs($recipe->created_at->diffInSeconds($searchDate));
                $this->info("  [MATCH] Found recipe (diff {$diff}s): {$recipe->name}");
            }

            // Track this ID
            $assignedRecipeIds[] = $recipe->id;

            $targetPath = $recipe->image_path;
            
            // If target path is null, we can't proceed unless we generate one.
            if (!$targetPath) {
                // Generate a new path
                $targetPath = 'recipes/' . \Illuminate\Support\Str::uuid() . '.webp';
                $this->info("  Recipe had no path, generated: $targetPath");
            }

            // Verify if target file already exists
            if (Storage::disk('public')->exists($targetPath)) {
                $this->warn("  Target file already exists: $targetPath. Skipping.");
                // Update DB anyway? No, dangerous.
                $skipped++;
                continue;
            }

            if ($dryRun) {
                $this->info("  [DRY RUN] Would convert $filename to $targetPath");
                continue;
            }

            try {
                // Convert and Save
                $image = Image::read($file->getPathname());
                $encoded = $image->toWebp(quality: 80);
                
                Storage::disk('public')->put($targetPath, (string) $encoded);
                
                // Update Recipe in DB
                $recipe->image_path = $targetPath;
                $recipe->save();
                
                $this->info("  [SUCCESS] Converted and linked to {$targetPath}");
                $matched++;
                
                // Optional: Rename/Move original to avoid reprocessing?
                $processedPath = $file->getPath() . '/processed/' . $filename;
                if (!File::exists($file->getPath() . '/processed')) {
                    File::makeDirectory($file->getPath() . '/processed');
                }
                File::move($file->getPathname(), $processedPath);
                
            } catch (\Exception $e) {
                $this->error("  [ERROR] Failed to process $filename: " . $e->getMessage());
                $errors++;
            }
        }

        $this->info("Done. Matched: $matched, Skipped: $skipped, Errors: $errors");
    }
}
