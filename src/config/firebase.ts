import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '***' // Hide API key in logs
});

let auth: Auth;
let db: Firestore;
// @ts-ignore - Analytics is not critical for core functionality
let analytics;
let googleProvider: GoogleAuthProvider;

// Initialize Firebase
try {
  console.log('Initializing Firebase with project:', firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  googleProvider = new GoogleAuthProvider();

  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

  // Add scopes for Google provider
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Connect to Firestore emulator in development
if (import.meta.env.DEV) {
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    connectFirestoreEmulator(db, 'localhost', 8080);
  });
}

export { auth, db, googleProvider, analytics }; 