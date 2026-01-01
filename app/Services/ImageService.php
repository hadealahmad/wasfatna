<?php

namespace App\Services;

use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Maximum file size in bytes (1MB).
     */
    private const MAX_SIZE = 10485760; // 10MB

    /**
     * Allowed image mime types.
     */
    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    /**
     * Process and store an uploaded image.
     * Strips metadata, compresses, and converts to WebP if needed.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @return array{path: string, success: bool, error?: string}
     */
    /**
     * Process and store an uploaded image.
     * Strips metadata, compresses, and converts to WebP if needed.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @return array{path: string, success: bool, error?: string}
     */
    public function processAndStore(UploadedFile $file, string $directory = 'recipes'): array
    {
        // Validate mime type
        if (!in_array($file->getMimeType(), self::ALLOWED_MIMES)) {
            return [
                'success' => false,
                'error' => 'نوع الملف غير مسموح. الأنواع المسموحة: JPEG, PNG, WebP, GIF',
                'path' => null,
            ];
        }

        // Check original size
        if ($file->getSize() > self::MAX_SIZE) {
            return [
                'success' => false,
                'error' => 'حجم الملف كبير جداً. الحد الأقصى 10 ميغابايت',
                'path' => null,
            ];
        }

        return $this->processImage($file->getPathname(), $directory);
    }

    /**
     * Process and store an image from a local file path.
     *
     * @param string $filePath
     * @param string $directory
     * @return array{path: string, success: bool, error?: string}
     */
    public function processFromFile(string $filePath, string $directory = 'recipes'): array
    {
        if (!file_exists($filePath)) {
            return [
                'success' => false,
                'error' => 'الملف غير موجود',
                'path' => null,
            ];
        }

        // Basic validation for local files could be added here (size, mime) if needed
        // For now, relies on processImage taking care of encoding

        return $this->processImage($filePath, $directory);
    }

    /**
     * Internal method to process image from a path.
     */
    private function processImage(string $sourcePath, string $directory): array
    {
        try {
            // Load image and strip metadata (EXIF, etc.)
            $image = Image::read($sourcePath);
            
            // Remove all metadata by encoding without profile
            // Intervention Image v3 automatically strips metadata
            
            // Generate unique filename
            $filename = Str::uuid() . '.webp';
            $path = $directory . '/' . $filename;

            // Encode as WebP with quality optimization
            $encoded = $image->toWebp(quality: 85);

            // Check if encoded size is acceptable
            $encodedSize = strlen($encoded->toString());
            
            if ($encodedSize > self::MAX_SIZE) {
                // Try lower quality
                $encoded = $image->toWebp(quality: 70);
                $encodedSize = strlen($encoded->toString());
                
                if ($encodedSize > self::MAX_SIZE) {
                    // Resize image
                    $image->scale(width: 1200);
                    $encoded = $image->toWebp(quality: 70);
                }
            }

            // Store the image
            Storage::disk('public')->put($path, $encoded->toString());

            return [
                'success' => true,
                'path' => $path,
                'error' => null,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => 'فشل في معالجة الصورة: ' . $e->getMessage(),
                'path' => null,
            ];
        }
    }

    /**
     * Delete an image from storage.
     */
    public function delete(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }
}
