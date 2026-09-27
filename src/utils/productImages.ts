import { ProductDeal, ColorVariant } from '../types';

/**
 * Extracts and normalizes all available image URLs for a product.
 * Supports:
 * - product.colorImages (array of { image, name, id } or strings, including base64 data URIs)
 * - product.colorVariants (array of { image, name, colorCode } or strings)
 * - product.images (string[], comma-separated string, JSON string, or object array)
 * - product.imageUrls (string[])
 * - product.gallery (string[])
 * - product.photos (string[])
 * - product.additionalImages (string[])
 * - product.image (single URL, base64 data URI, comma-separated URLs, or JSON array string)
 * - product.imageUrl (single URL, base64 data URI, comma-separated URLs, or JSON array string)
 */
export function extractAllImages(product: (Partial<ProductDeal> & Record<string, any>) | null | undefined): string[] {
  if (!product) return [];

  const rawList: string[] = [];

  const add = (val: any) => {
    if (!val) return;

    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return;

      // Base64 data URI: MUST NOT split by comma!
      if (trimmed.startsWith('data:image')) {
        if (!rawList.includes(trimmed)) {
          rawList.push(trimmed);
        }
        return;
      }

      // Check if it's a JSON stringified array like '["http...", "http..."]'
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            parsed.forEach(add);
            return;
          }
        } catch {
          // not valid JSON, proceed as string
        }
      }

      // Check for newline separated URLs
      if (trimmed.includes('\n')) {
        trimmed.split('\n').forEach(add);
        return;
      }

      // Check for comma separated URLs (e.g. "https://..., https://...")
      if (trimmed.includes(',')) {
        trimmed.split(',').forEach(add);
        return;
      }

      // Single URL
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('/')) {
        if (!rawList.includes(trimmed)) {
          rawList.push(trimmed);
        }
      } else if (trimmed.length > 5) {
        if (!rawList.includes(trimmed)) {
          rawList.push(trimmed);
        }
      }
    } else if (Array.isArray(val)) {
      val.forEach(add);
    } else if (typeof val === 'object') {
      // Support object structures like { image: '...' }, { imageUrl: '...' }, { url: '...' }, { src: '...' }
      if (val.image) add(val.image);
      else if (val.imageUrl) add(val.imageUrl);
      else if (val.url) add(val.url);
      else if (val.src) add(val.src);
    }
  };

  // 1. Primary main image
  add(product.image);
  add(product.imageUrl);

  // 2. Color Images from Firestore (colorImages: [{ name: '...', image: 'data:image...' }])
  if (Array.isArray(product.colorImages)) {
    product.colorImages.forEach((c) => {
      add(c);
    });
  }

  // 3. Color variants
  if (Array.isArray(product.colorVariants)) {
    product.colorVariants.forEach((v) => {
      add(v);
    });
  }

  // 4. Explicit image arrays or fields
  add(product.images);
  add(product.imageUrls);
  add(product.gallery);
  add(product.photos);
  add(product.additionalImages);

  // Deduplicate URLs while preserving original order
  const uniqueUrls: string[] = [];
  for (const url of rawList) {
    if (!uniqueUrls.includes(url)) {
      uniqueUrls.push(url);
    }
  }

  if (uniqueUrls.length === 0) {
    uniqueUrls.push('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80');
  }

  return uniqueUrls;
}

/**
 * Normalizes all color variants from either colorVariants or colorImages.
 */
export function getProductVariants(product: (Partial<ProductDeal> & Record<string, any>) | null | undefined): ColorVariant[] {
  if (!product) return [];

  const variants: ColorVariant[] = [];

  if (Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
    product.colorVariants.forEach((v, idx) => {
      if (v && v.image) {
        variants.push({
          id: v.id || `variant-${idx}`,
          name: v.name || `Option ${idx + 1}`,
          colorCode: v.colorCode,
          image: v.image
        });
      }
    });
  }

  if (Array.isArray(product.colorImages) && product.colorImages.length > 0) {
    product.colorImages.forEach((c, idx) => {
      const img = c.image || c.imageUrl || c.url;
      if (img && !variants.some(v => v.image === img)) {
        variants.push({
          id: c.id || `color-${idx}`,
          name: c.name || `Color ${idx + 1}`,
          colorCode: c.colorCode,
          image: img
        });
      }
    });
  }

  return variants;
}

/**
 * Returns the primary/main image to display on cards, banners, lists.
 */
export function getMainImage(product: (Partial<ProductDeal> & Record<string, any>) | null | undefined): string {
  const images = extractAllImages(product);
  return images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
}
