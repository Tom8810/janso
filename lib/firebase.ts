import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBNCPJ1Hc5WEUjmEWrNKvN6ejJEaxiX6lw",
  authDomain: "jansou-3138d.firebaseapp.com",
  projectId: "jansou-3138d",
  storageBucket: "jansou-3138d.firebasestorage.app",
  messagingSenderId: "565027363734",
  appId: "1:565027363734:web:63e1c2a0f1130c5d2edbb7",
  measurementId: "G-R9H6J5YH4P",
} as const;

// Ensure we don't re-initialize in Fast Refresh / multiple imports
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let analyticsPromise: Promise<Analytics | null> | null = null;

export const getFirebaseApp = () => app;

export const getFirebaseAnalytics = () => {
  if (typeof window === "undefined") return null;

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => {
        if (!supported) return null;
        return getAnalytics(app);
      })
      .catch(() => null);
  }

  return analyticsPromise;
};
