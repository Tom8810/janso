import { App, cert, getApps, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// --- Configuration & Validation ---

const isProduction = process.env.NODE_ENV === 'production';
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "jansou-3138d",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Validate credentials in production
if (isProduction) {
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.error(
      "Firebase Admin SDK initialization failed: Missing environment variables.",
      "Ensure FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
    );
    // We don't throw here to avoid crashing the build phase if env vars aren't present there,
    // but runtime usage will fail if these are missing.
  }
}

// --- Initialization ---

function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  if (isProduction) {
    // Check if we have explicit credentials
    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      return initializeApp({
        credential: cert(serviceAccount),
      });
    }

    // Fallback to Application Default Credentials (ADC)
    // This often works automatically on Cloud Run / GCP environments
    // and prevents build failures when env vars aren't present.
    console.warn("Initializing Firebase Admin with Application Default Credentials (missing explicit keys).");
    return initializeApp({
      projectId: serviceAccount.projectId || "jansou-3138d",
    });

  } else {
    // Development / Emulator
    return initializeApp({
      projectId: "jansou-3138d",
    });
  }
}

let app: App;
try {
  app = initializeAdminApp();
} catch (error) {
  console.error("Failed to initialize Firebase Admin App:", error);
  throw error; // Re-throw to ensure we don't proceed with a broken app
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

// --- Emulator Settings ---

if (!isProduction) {
  try {
    adminDb.settings({
      host: 'localhost:8080',
      ssl: false
    });
    console.log("Firestore emulator connected at localhost:8080");
  } catch (error) {
    // Settings might be already applied if HMR re-runs this module
    // console.debug("Firestore settings already configured or failed:", error);
  }
}
