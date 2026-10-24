import { ProductDeal } from '../types';

/**
 * Detects if the current user agent is mobile.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
}

export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /android/i.test(navigator.userAgent || '');
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent || '');
}

/**
 * Normalizes and extracts Daraz product identifier or path from an affiliate/web link.
 */
export function extractDarazPath(url: string): string {
  try {
    const parsed = new URL(url);
    // If it's a redirect or affiliate link like click.daraz.com.np?url=...
    if (parsed.searchParams.has('url')) {
      const nested = parsed.searchParams.get('url');
      if (nested) {
        return extractDarazPath(decodeURIComponent(nested));
      }
    }
    // Return pathname + search (excluding standard external tracking)
    return parsed.pathname + parsed.search;
  } catch {
    return url.replace(/^https?:\/\/(www\.)?daraz\.com\.np\/?/, '/');
  }
}

/**
 * Builds optimized affiliate URL with tracking parameters and mobile deep link fallback.
 */
export function buildAffiliateUrl(originalUrl: string, campaignName: string = 'darazdeals_np'): string {
  const safeFallback = 'https://www.daraz.com.np';
  if (!originalUrl || originalUrl === '#' || typeof originalUrl !== 'string') return safeFallback;

  const trimmed = originalUrl.trim();
  // Block any dangerous scheme injection
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return safeFallback;
  }

  try {
    const urlObj = new URL(trimmed.startsWith('/') ? `https://www.daraz.com.np${trimmed}` : trimmed);
    
    // Strict protocol check
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      return safeFallback;
    }

    // Restrict to Daraz domains or fallback
    const hostname = urlObj.hostname.toLowerCase();
    const isDaraz = hostname.endsWith('daraz.com.np') || hostname.endsWith('daraz.np') || hostname.endsWith('daraz.com');
    if (!isDaraz) {
      return safeFallback;
    }

    // Add CRO UTM & sub-id tracking parameters safely
    if (!urlObj.searchParams.has('utm_source')) {
      urlObj.searchParams.set('utm_source', 'darazdeals_np');
    }
    urlObj.searchParams.set('utm_medium', 'affiliate');
    urlObj.searchParams.set('utm_campaign', campaignName);
    urlObj.searchParams.set('ex_from', 'darazdeals_nepal');
    return urlObj.toString();
  } catch {
    return safeFallback;
  }
}

/**
 * Generates Daraz App deep link URI scheme:
 * - Scheme: daraz://np/p/.. or daraz://products/..
 * - On Android intent: intent://...#Intent;scheme=daraz;package=com.daraz.android;end
 */
export function getDarazAppDeepLink(webUrl: string): {
  deepLink: string;
  fallbackWebUrl: string;
} {
  const fallbackWebUrl = buildAffiliateUrl(webUrl);

  try {
    const parsed = new URL(fallbackWebUrl);
    const path = parsed.pathname.replace(/^\//, '');

    // Daraz Nepal deep-link scheme
    // Format: daraz://nepal/products/... or daraz://item?id=...
    const deepLink = `daraz://nepal/${path}${parsed.search}`;

    return {
      deepLink,
      fallbackWebUrl
    };
  } catch {
    return {
      deepLink: `daraz://nepal/home`,
      fallbackWebUrl
    };
  }
}

/**
 * Smoothly opens deep link on mobile with automatic fallback to Daraz web session.
 */
export function openDarazDeal(webUrl: string, targetAppOnly: boolean = false): void {
  const { deepLink, fallbackWebUrl } = getDarazAppDeepLink(webUrl);

  if (isMobileDevice()) {
    // If user explicitly requests App or is on mobile device
    const now = Date.now();
    
    // Try launching mobile app via custom scheme
    window.location.href = deepLink;

    // If app is not installed or fails to open within 1.2s, redirect to web
    setTimeout(() => {
      // If user is still on this webpage, the app did not open
      if (Date.now() - now < 2000) {
        window.open(fallbackWebUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1200);
  } else {
    // Desktop: open in new tab
    window.open(fallbackWebUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Returns high-converting, high-intent CTA button text based on product discounts and stock.
 */
export function getHighIntentCtaText(product: Partial<ProductDeal> | null | undefined): {
  primaryText: string;
  subText?: string;
  badgeText?: string;
} {
  if (!product) {
    return { primaryText: 'Check Price on Daraz App' };
  }

  const discount =
    product.originalPrice && product.originalPrice > (product.price || 0)
      ? Math.round((((product.originalPrice - (product.price || 0)) / product.originalPrice) * 100))
      : 0;

  if (discount >= 40) {
    return {
      primaryText: 'Grab Mega Deal',
      subText: `Save ${discount}% on Daraz App`,
      badgeText: `${discount}% OFF`
    };
  }

  if (discount >= 20) {
    return {
      primaryText: 'Check Discount on App',
      subText: 'Verified Price Drop',
      badgeText: 'Price Drop'
    };
  }

  return {
    primaryText: 'Grab Deal on Daraz App',
    subText: 'Direct Seller Link',
    badgeText: 'Verified Deal'
  };
}
