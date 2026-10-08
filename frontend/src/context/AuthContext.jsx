import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUserFirebase, setCurrentUserFirebase] = useState(null);
  const [demoUser, setDemoUser] = useState(() => {
    try {
      const saved = localStorage.getItem("prism_demo_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // auth is null when Firebase is not configured (no .env).
    // In that case treat as "not logged in" via Firebase immediately.
    if (!auth) {
      setLoading(false);
      return;
    }
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUserFirebase(user);
        setLoading(false);
      }, (error) => {
        console.error("Firebase Auth error:", error.message);
        setLoading(false);
      });
    } catch (error) {
      console.error("Firebase Auth initialisation error:", error.message);
      setLoading(false);
    }
    return unsubscribe;
  }, []);

  const loginDemo = (name, password) => {
    const trimmedName = (name || "Demo Student").trim();
    const userObj = {
      uid: "demo_" + trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      displayName: trimmedName,
      email: `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "")}@demo.prism`,
      isDemo: true
    };
    localStorage.setItem("prism_demo_user", JSON.stringify(userObj));
    setDemoUser(userObj);
    return Promise.resolve(userObj);
  };

  const loginWithGoogle = () => {
    if (!auth) return Promise.reject(new Error("Sign-in isn't available in this environment yet."));
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = (email, password) => {
    if (!auth) return Promise.reject(new Error("Sign-in isn't available in this environment yet."));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = (email, password) => {
    if (!auth) return Promise.reject(new Error("Sign-in isn't available in this environment yet."));
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const setupRecaptcha = (containerId) => {
    if (!auth) return null;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
    return window.recaptchaVerifier;
  };

  const sendPhoneOTP = (phoneNumber, appVerifier) => {
    if (!auth) return Promise.reject(new Error("Sign-in isn't available in this environment yet."));
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const logout = () => {
    localStorage.removeItem("prism_demo_user");
    localStorage.removeItem("prism_demo_student");
    localStorage.removeItem("prism_demo_parent");
    localStorage.removeItem("prism_demo_assessment");
    localStorage.removeItem("prism_session");
    localStorage.removeItem("prism_ai_result");
    localStorage.removeItem("prism_selected_career");
    setDemoUser(null);
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  const currentUser = currentUserFirebase || demoUser;
  const isDemoMode = !currentUserFirebase && !!demoUser;

  const value = {
    currentUser,
    isDemoMode,
    loginDemo,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    setupRecaptcha,
    sendPhoneOTP,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
