import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import type { FirebaseConfig } from '../types/firebase';

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes for profile and email
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Connect to Firestore emulator in development
if (import.meta.env.DEV) {
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    connectFirestoreEmulator(db, 'localhost', 8080);
  });
}

// Initialize analytics only in production
const analytics = import.meta.env.PROD ? getAnalytics(app) : null;

export { analytics };
export default app; 