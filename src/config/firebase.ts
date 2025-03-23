import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

// List of authorized domains for authentication
const authorizedDomains = [
  'localhost',
  'ecodrive-git-main-shivam-s-projects-387f222a.vercel.app'
];

// Check if current domain is authorized
const currentDomain = window.location.hostname;
if (!authorizedDomains.includes(currentDomain)) {
  console.warn(`Warning: ${currentDomain} is not in the list of authorized domains for Firebase Authentication. 
    Please add it to the Firebase Console -> Authentication -> Settings -> Authorized domains`);
}

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '***' // Hide API key in logs
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics }; 