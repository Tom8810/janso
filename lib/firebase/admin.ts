import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin only on server-side
if (getApps().length === 0) {
  const isEmulator = process.env.NODE_ENV !== 'production';

  if (isEmulator) {
    // For development with emulator
    initializeApp({
      projectId: "jansou-3138d",
    });
  } else {
    // For production with credentials
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "jansou-3138d",
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

// Configure emulator settings for development - only once during initialization
if (process.env.NODE_ENV !== 'production' && getApps().length === 1) {
  try {
    adminDb.settings({
      host: 'localhost:8080',
      ssl: false
    });
  } catch (error) {
    // Settings already configured, ignore
  }
}
