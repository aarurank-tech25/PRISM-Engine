import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Only initialise Firebase when a real apiKey is configured.
// Without it, getAuth() throws auth/invalid-api-key at import time and
// crashes the entire React tree to a blank page.
let app = null;
let auth = null;
let googleProvider = null;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  console.warn(
    "[PRISM] Firebase is not configured. " +
    "Create frontend/.env with your VITE_FIREBASE_* keys to enable authentication."
  );
}

export { app, auth, googleProvider };

