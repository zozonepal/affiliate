export interface ProductDeal {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  promoCode?: string;
  image: string;
  affiliateUrl: string;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  upvotes?: number;
  upvotedBy?: string[];
  inStock?: boolean;
  seller?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface UserAccount {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: 'admin' | 'user';
  wishlist: string[];
  isAnonymous?: boolean;
}

export type CloudSyncStatus = 'connected' | 'connecting' | 'fallback' | 'error';

export type PriceFilterRange = 'all' | 'under1k' | '1k-3k' | '3k-5k' | 'over5k';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'popular' | 'newest';
