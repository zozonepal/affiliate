/**
 * Utility for compressing and optimizing user-uploaded images in the browser.
 * Reduces raw mobile photos (often 5MB - 15MB) into lightweight, crisp WebP/JPEG data URLs (~25KB - 60KB).
 * This ensures multi-image products never exceed Google Cloud Firestore's 1MB (1,048,576 bytes) document limit.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Compresses an image File or Data URL to an optimized data URL.
 */
export async function compressImage(
  source: File | string,
  options: CompressionOptions = {}
): Promise<{ dataUrl: string; sizeBytes: number; originalSizeBytes: number }> {
  const {
    maxWidth = 850,
    maxHeight = 850,
    quality = 0.76,
    format = 'image/webp'
  } = options;

  let originalSizeBytes = 0;
  if (source instanceof File) {
    originalSizeBytes = source.size;
  } else if (typeof source === 'string') {
    originalSizeBytes = Math.round(source.length * 0.75); // approximate base64 bytes
  }

  // Load the image into an Image element
  const img = await loadImage(source);

  // Calculate proportional constrained dimensions
  let { width, height } = img;
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Render to canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // High quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw white background in case of transparent PNG being converted
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(img, 0, 0, width, height);

  // Try WebP first, fallback to JPEG if browser doesn't support WebP export
  let dataUrl = canvas.toDataURL(format, quality);
  if (!dataUrl.startsWith(`data:${format}`)) {
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  const compressedSizeBytes = Math.round(dataUrl.length * 0.75);

  return {
    dataUrl,
    sizeBytes: compressedSizeBytes,
    originalSizeBytes
  };
}

/**
 * Safely loads a File or URL into an HTMLImageElement
 */
function loadImage(source: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    if (source instanceof File) {
      const url = URL.createObjectURL(source);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load selected image file'));
      };
      img.src = url;
    } else {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image from source URL'));
      img.src = source;
    }
  });
}

/**
 * Calculates the exact UTF-8 byte size of any object as it would be serialized in JSON.
 */
export function estimatePayloadBytes(payload: unknown): number {
  try {
    const jsonStr = JSON.stringify(payload);
    return new Blob([jsonStr]).size;
  } catch {
    return 0;
  }
}

/**
 * Human-readable byte size formatter (e.g. "45 KB", "1.2 MB")
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
