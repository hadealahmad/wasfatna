<?php

namespace App\Console\Commands;

use App\Models\Recipe;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Services\ImageService;

class ImportRecipeImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recipes:import-images {path : Path to the directory containing images}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import images for recipes from a directory based on filename matching';

    public function __construct(
        private ImageService $imageService
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = $this->argument('path');

        if (!File::isDirectory($path)) {
            $this->error("Directory not found: {$path}");
            return 1;
        }

        $files = File::files($path);
        
        $this->info("Found " . count($files) . " files in directory.");

        // Ensure target directory exists
        Storage::disk('public')->makeDirectory('recipes');

        foreach ($files as $file) {
            $filename = $file->getFilenameWithoutExtension();
            $extension = $file->getExtension();
            
            // Normalize filename to match recipe name
            // Replace underscores with spaces
            $recipeName = str_replace('_', ' ', $filename);
            
            $this->line("Processing: {$filename} -> Looking for recipe: '{$recipeName}'");

            // Find recipe
            $recipe = Recipe::where('name', 'LIKE', $recipeName)->first();

            if (!$recipe) {
                // Try fuzzy match or exact match variations?
                // For now just exact match on the normalized string
                $this->warn("  [SKIPPED] No matching recipe found for '{$recipeName}'");
                continue;
            }

            if ($recipe->image_path) {
                $this->info("  [SKIPPED] Recipe '{$recipe->name}' already has an image.");
                continue;
            }

            // Process and store image
            $result = $this->imageService->processFromFile($file->getPathname());
            
            if ($result['success']) {
                // Update recipe
                $recipe->image_path = $result['path'];
                $recipe->save();

                $this->info("  [SUCCESS] Match found! Image assigned to '{$recipe->name}'");
            } else {
                $this->error("  [ERROR] Failed to process image: " . $result['error']);
            }
        }

        $this->info("Import completed.");
        return 0;
    }
}
