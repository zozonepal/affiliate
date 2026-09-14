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
  'fitoorbhandari38@gmail.com',
  'affiliatedaraz25@gmail.com',
  'zozonepal5@gmail.com',
  'admin@dealfinder.np'
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
  // When an admin adds a new product, clear pre-products flag so pre-products don't conflict
  clearAllPreProducts();
  const productsRef = collection(db, 'products');
  const payload = {
    ...deal,
    price: Number(deal.price),
    originalPrice: deal.originalPrice ? Number(deal.originalPrice) : null,
    upvotes: deal.upvotes || 0,
    upvotedBy: deal.upvotedBy || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  return await addDoc(productsRef, payload);
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
    ...updates,
    updatedAt: serverTimestamp()
  };
  if (updates.price !== undefined) payload.price = Number(updates.price);
  if (updates.originalPrice !== undefined) payload.originalPrice = Number(updates.originalPrice);
  return await updateDoc(docRef, payload);
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
  const result = await signInWithPopup(auth, googleProvider);
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
