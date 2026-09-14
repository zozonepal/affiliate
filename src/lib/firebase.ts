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

/**
 * Real-time listener for products
 */
export function subscribeToProducts(
  onData: (products: ProductDeal[], status: CloudSyncStatus) => void,
  onError?: (err: any) => void
) {
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

        // If firestore is completely empty, offer the initial sample deals so UI is never blank
        if (items.length === 0) {
          const localMapped: ProductDeal[] = INITIAL_DEALS.map((d, index) => ({
            id: `sample-${index + 1}`,
            ...d
          }));
          onData(localMapped, 'connected');
        } else {
          onData(items, 'connected');
        }
      },
      (error) => {
        logFirestoreError('subscribeToProducts', 'products', error);
        if (onError) onError(error);
        
        // Fallback to local deals so user always has working UI
        const localMapped: ProductDeal[] = INITIAL_DEALS.map((d, index) => ({
          id: `sample-${index + 1}`,
          ...d
        }));
        onData(localMapped, 'fallback');
      }
    );

    return unsubscribe;
  } catch (err) {
    logFirestoreError('subscribeToProducts.catch', 'products', err);
    const localMapped: ProductDeal[] = INITIAL_DEALS.map((d, index) => ({
      id: `sample-${index + 1}`,
      ...d
    }));
    onData(localMapped, 'fallback');
    return () => {};
  }
}

/**
 * Add a new product deal to Firestore
 */
export async function addProductToFirestore(deal: Omit<ProductDeal, 'id'>) {
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
 * Delete a product deal from Firestore
 */
export async function deleteProductFromFirestore(id: string) {
  const docRef = doc(db, 'products', id);
  return await deleteDoc(docRef);
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
