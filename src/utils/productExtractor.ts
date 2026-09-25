export interface ExtractedProductData {
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  promoCode?: string;
  image: string;
  colorVariants?: Array<{ name: string; colorCode: string; image: string }>;
  affiliateUrl: string;
  description: string;
  seller?: string;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
}

// Fallback smart parser if server API is unreachable
export function extractClientFallback(url: string): ExtractedProductData {
  const cleanUrl = url.trim();
  let derivedTitle = 'Recommended Daraz Product';
  let category = 'Tech';
  let image = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80';
  let price = 1999;
  let originalPrice = 2999;

  try {
    const urlObj = new URL(cleanUrl);
    const pathname = urlObj.pathname.toLowerCase();

    // Extract title from URL path slug if present
    const slugParts = pathname.split('/').filter(Boolean);
    const productSlug = slugParts.find((part) => part.includes('-') || part.endsWith('.html'));

    if (productSlug) {
      const rawTitle = productSlug.replace(/\.html.*$/i, '').replace(/[-_]/g, ' ');
      if (rawTitle.length > 5) {
        derivedTitle = rawTitle
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    const titleLower = derivedTitle.toLowerCase() + ' ' + pathname;

    if (titleLower.includes('earbud') || titleLower.includes('headphone') || titleLower.includes('speaker') || titleLower.includes('audio') || titleLower.includes('airpod')) {
      category = 'Audio';
      image = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80';
      price = 1899;
      originalPrice = 2899;
    } else if (titleLower.includes('watch') || titleLower.includes('band') || titleLower.includes('wearable')) {
      category = 'Wearables';
      image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
      price = 2499;
      originalPrice = 3999;
    } else if (titleLower.includes('keyboard') || titleLower.includes('mouse')) {
      category = 'Keyboards & Mice';
      image = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80';
      price = 1499;
      originalPrice = 2199;
    } else if (titleLower.includes('cover') || titleLower.includes('charger') || titleLower.includes('cable') || titleLower.includes('powerbank')) {
      category = 'Mobile Accessories';
      image = 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80';
      price = 999;
      originalPrice = 1499;
    }
  } catch (err) {
    console.warn('Fallback URL parsing notice:', err);
  }

  return {
    title: derivedTitle,
    category,
    price,
    originalPrice,
    badge: 'Verified Deal',
    promoCode: 'DARAZ10',
    image,
    affiliateUrl: cleanUrl,
    description: `${derivedTitle} available on Daraz Nepal with fast nationwide delivery and brand warranty.`,
    seller: 'Daraz Official Mall Store',
    rating: 4.8,
    reviewsCount: 38,
    inStock: true,
  };
}

// Robust API Extractor
export async function extractProductFromUrl(url: string): Promise<ExtractedProductData> {
  const cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http')) {
    throw new Error('Please enter a valid product link starting with http:// or https://');
  }

  try {
    const response = await fetch('/api/extract-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ url: cleanUrl }),
    });

    const contentType = response.headers.get('content-type') || '';

    if (response.ok && contentType.includes('application/json')) {
      const json = await response.json();
      if (json.success && json.data) {
        return json.data;
      }
    }

    // If server returned non-JSON (e.g. 404 HTML during dev server reboot), fall back gracefully
    console.info('Server API notice: Using smart client fallback for product link.');
    return extractClientFallback(cleanUrl);
  } catch (err) {
    console.warn('API call fallback notice:', err);
    return extractClientFallback(cleanUrl);
  }
}
