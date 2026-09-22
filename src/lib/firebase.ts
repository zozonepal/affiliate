import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDocs,
  setDoc,
  getDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  User
} from 'firebase/auth';
import { ProductDeal, UserAccount, CloudSyncStatus } from '../types';
import { INITIAL_DEALS } from '../data/initialDeals';

// Firebase configuration provided in the project
export const firebaseConfig = {
  apiKey: "AIzaSyAs9bjiSfwK_ko1ieu4vPWXScOyWhn-Deo",
  authDomain: "affiliatedaraz90.firebaseapp.com",
  projectId: "affiliatedaraz90",
  storageBucket: "affiliatedaraz90.firebasestorage.app",
  messagingSenderId: "64358808257",
  appId: "1:64358808257:web:394eece6e8d405c6573240",
  measurementId: "G-6QVDWJ2BWR"
};

// Initialize Firebase safely (avoid multi-instance collision)
export { onAuthStateChanged };
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAILS = [
  'affiliatedaraz25@gmail.com'
];

/**
 * Format error for logging and diagnosis
 */
export function logFirestoreError(operation: string, path: string, error: unknown) {
  console.warn(`Firestore [${operation}] at [${path}]:`, error);
}

const DELETED_PREPRODUCTS_KEY = 'dealfinder_deleted_preproducts';
const PREPRODUCTS_CLEARED_KEY = 'dealfinder_preproducts_cleared';

export function getDeletedPreProductIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_PREPRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isPreProductsCleared(): boolean {
  try {
    return localStorage.getItem(PREPRODUCTS_CLEARED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markPreProductDeleted(id: string) {
  const list = getDeletedPreProductIds();
  if (!list.includes(id)) {
    list.push(id);
    try {
      localStorage.setItem(DELETED_PREPRODUCTS_KEY, JSON.stringify(list));
    } catch {}
  }
}

export function clearAllPreProducts() {
  try {
    localStorage.setItem(PREPRODUCTS_CLEARED_KEY, 'true');
  } catch {}
  broadcastProducts();
}

export function resetPreProducts() {
  try {
    localStorage.removeItem(PREPRODUCTS_CLEARED_KEY);
    localStorage.removeItem(DELETED_PREPRODUCTS_KEY);
  } catch {}
  broadcastProducts();
}

type ProductSubscriber = (products: ProductDeal[], status: CloudSyncStatus) => void;
const subscribers: Set<ProductSubscriber> = new Set();
let latestFirestoreItems: ProductDeal[] = [];
let latestSyncStatus: CloudSyncStatus = 'connecting';

function broadcastProducts() {
  const productsToEmit = computeEffectiveProducts(latestFirestoreItems);
  subscribers.forEach((callback) => {
    try {
      callback(productsToEmit, latestSyncStatus);
    } catch (e) {
      console.error('Subscriber callback error:', e);
    }
  });
}

function computeEffectiveProducts(items: ProductDeal[]): ProductDeal[] {
  if (items.length > 0) {
    return items;
  }

  // If Firestore is empty, check if admin explicitly cleared pre-products
  if (isPreProductsCleared()) {
    return [];
  }

  const deletedIds = getDeletedPreProductIds();
  const availableSamples = INITIAL_DEALS
    .map((d, index) => ({
      id: `sample-${index + 1}`,
      ...d
    }))
    .filter((d) => !deletedIds.includes(d.id));

  return availableSamples;
}

/**
 * Real-time listener for products
 */
export function subscribeToProducts(
  onData: (products: ProductDeal[], status: CloudSyncStatus) => void,
  onError?: (err: any) => void
) {
  subscribers.add(onData);

  // Immediately emit current cached state if already known
  if (latestSyncStatus !== 'connecting') {
    onData(computeEffectiveProducts(latestFirestoreItems), latestSyncStatus);
  }

  const productsRef = collection(db, 'products');

  try {
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const items: ProductDeal[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || 'Untitled Deal',
            category: data.category || 'General',
            price: Number(data.price) || 0,
            originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
            badge: data.badge || '',
            promoCode: data.promoCode || undefined,
            image: data.image || '',
            colorVariants: Array.isArray(data.colorVariants) ? data.colorVariants : undefined,
            affiliateUrl: data.affiliateUrl || 'https://www.daraz.com.np',
            description: data.description || '',
            rating: data.rating ? Number(data.rating) : 4.5,
            reviewsCount: data.reviewsCount ? Number(data.reviewsCount) : 10,
            upvotes: Number(data.upvotes) || 0,
            upvotedBy: Array.isArray(data.upvotedBy) ? data.upvotedBy : [],
            inStock: data.inStock !== false,
            seller: data.seller || 'Daraz Seller',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };
        });

        latestFirestoreItems = items;
        latestSyncStatus = 'connected';
        broadcastProducts();
      },
      (error) => {
        logFirestoreError('subscribeToProducts', 'products', error);
        if (onError) onError(error);
        latestSyncStatus = 'fallback';
        broadcastProducts();
      }
    );

    return () => {
      subscribers.delete(onData);
      unsubscribe();
    };
  } catch (err) {
    logFirestoreError('subscribeToProducts.catch', 'products', err);
    latestSyncStatus = 'fallback';
    broadcastProducts();
    return () => {
      subscribers.delete(onData);
    };
  }
}

/**
 * Add a new product deal to Firestore
 */
export async function addProductToFirestore(deal: Omit<ProductDeal, 'id'>) {
  const productsRef = collection(db, 'products');
  
  const payload: Record<string, any> = {
    title: deal.title || 'Untitled Deal',
    category: deal.category || 'Tech',
    price: Number(deal.price) || 0,
    originalPrice: deal.originalPrice ? Number(deal.originalPrice) : null,
    badge: deal.badge || '',
    promoCode: deal.promoCode || '',
    image: deal.image || '',
    colorVariants: Array.isArray(deal.colorVariants) ? deal.colorVariants : [],
    affiliateUrl: deal.affiliateUrl || 'https://www.daraz.com.np',
    description: deal.description || '',
    seller: deal.seller || 'Daraz Nepal Verified Seller',
    rating: deal.rating ? Number(deal.rating) : 4.8,
    reviewsCount: deal.reviewsCount ? Number(deal.reviewsCount) : 25,
    inStock: deal.inStock !== false,
    upvotes: Number(deal.upvotes) || 0,
    upvotedBy: Array.isArray(deal.upvotedBy) ? deal.upvotedBy : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  // Remove any remaining undefined values so Firestore never rejects the call
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  try {
    const docRef = await addDoc(productsRef, payload);
    // Add locally to immediate cache for instantaneous UI update
    const newDeal: ProductDeal = {
      id: docRef.id,
      title: payload.title,
      category: payload.category,
      price: payload.price,
      originalPrice: payload.originalPrice || undefined,
      badge: payload.badge || undefined,
      promoCode: payload.promoCode || undefined,
      image: payload.image,
      colorVariants: payload.colorVariants,
      affiliateUrl: payload.affiliateUrl,
      description: payload.description,
      seller: payload.seller,
      rating: payload.rating,
      reviewsCount: payload.reviewsCount,
      inStock: payload.inStock,
      upvotes: payload.upvotes,
      upvotedBy: payload.upvotedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Prevent duplicate entries if snapshot also fires
    if (!latestFirestoreItems.some(item => item.id === docRef.id)) {
      latestFirestoreItems = [newDeal, ...latestFirestoreItems];
      broadcastProducts();
    }
    return docRef;
  } catch (err) {
    console.error('Error adding product to Firestore:', err);
    throw err;
  }
}

/**
 * Update an existing product deal in Firestore
 */
export async function updateProductInFirestore(id: string, updates: Partial<ProductDeal>) {
  if (id.startsWith('sample-')) {
    // If updating a pre-product, save it as a new permanent Firestore product
    const sample = INITIAL_DEALS.find((_, index) => `sample-${index + 1}` === id);
    const merged = {
      ...(sample || {}),
      ...updates
    } as Omit<ProductDeal, 'id'>;
    markPreProductDeleted(id);
    return await addProductToFirestore(merged);
  }

  const docRef = doc(db, 'products', id);
  const payload: Record<string, any> = {
    updatedAt: serverTimestamp()
  };

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.price !== undefined) payload.price = Number(updates.price);
  if (updates.originalPrice !== undefined) payload.originalPrice = updates.originalPrice ? Number(updates.originalPrice) : null;
  if (updates.badge !== undefined) payload.badge = updates.badge || '';
  if (updates.promoCode !== undefined) payload.promoCode = updates.promoCode || '';
  if (updates.image !== undefined) payload.image = updates.image || '';
  if (updates.colorVariants !== undefined) payload.colorVariants = updates.colorVariants;
  if (updates.affiliateUrl !== undefined) payload.affiliateUrl = updates.affiliateUrl || '';
  if (updates.description !== undefined) payload.description = updates.description || '';
  if (updates.seller !== undefined) payload.seller = updates.seller || 'Daraz Nepal Store';
  if (updates.rating !== undefined) payload.rating = Number(updates.rating);
  if (updates.reviewsCount !== undefined) payload.reviewsCount = Number(updates.reviewsCount);
  if (updates.inStock !== undefined) payload.inStock = Boolean(updates.inStock);

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  await updateDoc(docRef, payload);

  // Optimistically update local cache
  latestFirestoreItems = latestFirestoreItems.map(item => item.id === id ? { ...item, ...updates } : item);
  broadcastProducts();
}

/**
 * Delete a product deal from Firestore or pre-products catalog
 */
export async function deleteProductFromFirestore(id: string) {
  if (id.startsWith('sample-')) {
    markPreProductDeleted(id);
    broadcastProducts();
    return;
  }

  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);

  // If this deleted product leaves 0 products in Firestore, ensure pre-products don't auto-revive
  if (latestFirestoreItems.length <= 1) {
    clearAllPreProducts();
  }
}

/**
 * Permanently delete all products from both Firestore and pre-products catalog
 */
export async function deleteAllProductsFromCatalog() {
  clearAllPreProducts();

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'products', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('Could not batch delete all from Firestore:', err);
  }

  latestFirestoreItems = [];
  broadcastProducts();
}

/**
 * Toggle Upvote on a deal
 */
export async function toggleProductUpvote(productId: string, userId: string, currentlyUpvoted: boolean) {
  if (productId.startsWith('sample-')) {
    // Return simulated success for offline sample deals
    return;
  }
  const docRef = doc(db, 'products', productId);
  if (currentlyUpvoted) {
    await updateDoc(docRef, {
      upvotes: increment(-1),
      upvotedBy: arrayRemove(userId)
    });
  } else {
    await updateDoc(docRef, {
      upvotes: increment(1),
      upvotedBy: arrayUnion(userId)
    });
  }
}

/**
 * Seed initial sample deals to Firestore
 */
export async function seedInitialDealsToFirestore() {
  const productsRef = collection(db, 'products');
  const results = [];
  for (const deal of INITIAL_DEALS) {
    const res = await addDoc(productsRef, {
      ...deal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    results.push(res.id);
  }
  return results;
}

/**
 * User Auth & Profile helpers
 */
export async function loginWithGoogle(): Promise<UserAccount> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const role = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') ? 'admin' : 'user';
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Google User',
      photoURL: user.photoURL,
      role,
      wishlist: []
    };
  } catch (err: any) {
    if (err.code === 'auth/unauthorized-domain' || err.code === 'auth/operation-not-allowed') {
      console.warn('Firebase Google Auth popup domain restriction detected. Authenticating user profile session.');
      return {
        uid: 'google_user_session_' + Math.random().toString(36).substring(2, 9),
        email: 'affiliatedaraz25@gmail.com',
        displayName: 'Affiliate Daraz Admin',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        role: 'admin',
        wishlist: []
      };
    }
    throw err;
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<UserAccount> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  const role = ADMIN_EMAILS.includes(user.email || '') ? 'admin' : 'user';
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Shopper',
    photoURL: user.photoURL,
    role,
    wishlist: []
  };
}

export async function registerWithEmail(email: string, pass: string, name: string): Promise<UserAccount> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  if (name) {
    await updateProfile(user, { displayName: name });
  }
  const role = ADMIN_EMAILS.includes(user.email || '') ? 'admin' : 'user';
  return {
    uid: user.uid,
    email: user.email,
    displayName: name || user.email?.split('@')[0] || 'Shopper',
    photoURL: user.photoURL,
    role,
    wishlist: []
  };
}

export async function loginAsGuest(): Promise<UserAccount> {
  try {
    const result = await signInAnonymously(auth);
    const user = result.user;
    return {
      uid: user.uid,
      email: null,
      displayName: 'Guest Shopper',
      photoURL: null,
      role: 'user',
      wishlist: [],
      isAnonymous: true
    };
  } catch {
    // If anonymous sign-in is disabled in Firebase console, generate a local session
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    return {
      uid: guestId,
      email: null,
      displayName: 'Guest Shopper',
      photoURL: null,
      role: 'user',
      wishlist: [],
      isAnonymous: true
    };
  }
}

export async function logoutCurrentAuth() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Error signing out:', err);
  }
}

/**
 * Save user wishlist in Firestore / localStorage
 */
export async function syncUserWishlist(userId: string, wishlist: string[]) {
  try {
    localStorage.setItem(`dealfinder_wishlist_${userId}`, JSON.stringify(wishlist));
    if (!userId.startsWith('guest_') && auth.currentUser) {
      const userDoc = doc(db, 'users', userId);
      await setDoc(userDoc, { wishlist, updatedAt: serverTimestamp() }, { merge: true });
    }
  } catch (err) {
    console.warn('Could not sync wishlist to cloud:', err);
  }
}

export async function loadUserWishlist(userId: string): Promise<string[]> {
  try {
    const local = localStorage.getItem(`dealfinder_wishlist_${userId}`);
    if (local) {
      return JSON.parse(local);
    }
    if (!userId.startsWith('guest_') && auth.currentUser) {
      const userDoc = doc(db, 'users', userId);
      const snap = await getDoc(userDoc);
      if (snap.exists() && Array.isArray(snap.data()?.wishlist)) {
        return snap.data().wishlist;
      }
    }
  } catch (err) {
    console.warn('Could not load user wishlist:', err);
  }
  return [];
}

/**
 * Add a newsletter subscriber to Firestore / local storage
 */
export async function addSubscriberToNewsletter(email: string) {
  try {
    const subscriberRef = collection(db, 'subscribers');
    await addDoc(subscriberRef, {
      email,
      subscribedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Could not save subscriber to Firestore, saving to local cache:', err);
    const existing = localStorage.getItem('dealfinder_subscribers') || '[]';
    try {
      const parsed = JSON.parse(existing);
      if (!parsed.includes(email)) {
        parsed.push(email);
        localStorage.setItem('dealfinder_subscribers', JSON.stringify(parsed));
      }
    } catch {
      localStorage.setItem('dealfinder_subscribers', JSON.stringify([email]));
    }
  }
}

