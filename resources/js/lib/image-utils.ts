/**
 * Image compression utility for client-side image processing.
 * - Compresses images to WebP format
 * - Enforces 1MB max size
 * - Strips EXIF metadata automatically through canvas re-encoding
 */

const MAX_SIZE_BYTES = 1024 * 1024; // 1MB
const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.5;
const MAX_DIMENSION = 1920;

interface CompressResult {
    success: boolean;
    file?: File;
    error?: string;
}

/**
 * Load an image from a file
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('فشل في تحميل الصورة'));

        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
        reader.readAsDataURL(file);
    });
}

/**
 * Compress image using canvas
 */
function compressToBlob(
    img: HTMLImageElement,
    maxWidth: number,
    maxHeight: number,
    quality: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if needed
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('فشل في إنشاء السياق'));
            return;
        }

        // Draw image - this automatically strips EXIF data
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('فشل في ضغط الصورة'));
                }
            },
            'image/webp',
            quality
        );
    });
}

/**
 * Compress an image file to be under 1MB.
 * Automatically strips metadata through canvas re-encoding.
 */
export async function compressImage(file: File): Promise<CompressResult> {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        return {
            success: false,
            error: 'يرجى اختيار ملف صورة',
        };
    }

    try {
        const img = await loadImage(file);

        let quality = INITIAL_QUALITY;
        let maxDim = MAX_DIMENSION;
        let blob: Blob;

        // Try compression with decreasing quality
        while (quality >= MIN_QUALITY) {
            blob = await compressToBlob(img, maxDim, maxDim, quality);

            if (blob.size <= MAX_SIZE_BYTES) {
                const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^.]+$/, '.webp'),
                    { type: 'image/webp' }
                );

                return {
                    success: true,
                    file: compressedFile,
                };
            }

            // Reduce quality for next attempt
            quality -= 0.1;
        }

        // If still too large, also reduce dimensions
        while (maxDim >= 800) {
            maxDim -= 200;
            blob = await compressToBlob(img, maxDim, maxDim, MIN_QUALITY);

            if (blob.size <= MAX_SIZE_BYTES) {
                const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^.]+$/, '.webp'),
                    { type: 'image/webp' }
                );

                return {
                    success: true,
                    file: compressedFile,
                };
            }
        }

        return {
            success: false,
            error: 'الصورة كبيرة جداً ولا يمكن ضغطها إلى أقل من 1 ميغابايت',
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'فشل في معالجة الصورة',
        };
    }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): string | null {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        return 'نوع الملف غير مسموح. الأنواع المسموحة: JPEG, PNG, WebP, GIF';
    }

    return null;
}
