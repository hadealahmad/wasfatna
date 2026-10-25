<?php

namespace App\Services;

use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Maximum file size in bytes (10MB).
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

            // Always scale down large images before encoding
            $image->scaleDown(width: 1200, height: 1200);

            // Generate unique filename
            $filename = Str::uuid() . '.webp';
            $path = $directory . '/' . $filename;

            // Encode once as WebP with quality optimization
            $encoded = $image->toWebp(quality: 82);
            $encodedString = $encoded->toString();

            // Only re-encode at lower quality if still exceeding MAX_SIZE
            if (strlen($encodedString) > self::MAX_SIZE) {
                $encoded = $image->toWebp(quality: 70);
                $encodedString = $encoded->toString();
            }

            // Store the image
            Storage::disk('public')->put($path, $encodedString);

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
