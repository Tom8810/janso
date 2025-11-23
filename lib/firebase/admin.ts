import { initializeApp, getApps, cert } from "firebase-admin/app";
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
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

// Configure emulator settings for development
if (process.env.NODE_ENV !== 'production') {
  adminDb.settings({
    host: 'localhost:8080',
    ssl: false
  });
}