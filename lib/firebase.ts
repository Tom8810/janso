import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, connectFirestoreEmulator, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Firestore Emulator (development) configuration
if (process.env.NODE_ENV !== "production") {
  try {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
  } catch {
    // エミュレーター未起動時やブラウザ以外の環境では黙って失敗させる
  }
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => auth;
export const getFirebaseFirestore = () => db;

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

// Auth functions
export const signInParlor = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get parlor data from Firestore
    const parlorDoc = await getDoc(doc(db, 'parlors', user.uid));
    if (!parlorDoc.exists()) {
      throw new Error('雀荘データが見つかりません');
    }

    return {
      user,
      parlor: { id: parlorDoc.id, ...parlorDoc.data() }
    };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const registerParlor = async (email: string, password: string, parlorData: {
  name: string;
  address: string;
  addressDetails?: {
    postalCode: string;
    prefecture: string;
    address1: string;
    address2: string;
    building: string;
  };
  phoneNumber: string;
  businessHours: { open: string; close: string };
  description?: string;
  maxCapacity: number;
  ownerName: string;
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save parlor data to Firestore
    await setDoc(doc(db, 'parlors', user.uid), {
      ...parlorData,
      ownerEmail: email,
      createdAt: new Date(),
      updatedAt: new Date(),
      rooms: []
    });

    return { user, parlor: { id: user.uid, ...parlorData } };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const signOutParlor = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('ログアウトに失敗しました');
  }
};

// Firestore functions
export const updateParlorRooms = async (parlorId: string, rooms: any[]) => {
  try {
    await updateDoc(doc(db, 'parlors', parlorId), {
      rooms,
      updatedAt: new Date()
    });
  } catch (error) {
    throw new Error('ルームデータの更新に失敗しました');
  }
};

export const getParlorById = async (parlorId: string) => {
  try {
    const parlorDoc = await getDoc(doc(db, 'parlors', parlorId));
    if (!parlorDoc.exists()) {
      throw new Error('雀荘が見つかりません');
    }
    return { id: parlorDoc.id, ...parlorDoc.data() };
  } catch (error) {
    throw new Error('雀荘データの取得に失敗しました');
  }
};

export const getAllParlors = async () => {
  try {
    const parlorCollection = collection(db, 'parlors');
    const parlorSnapshot = await getDocs(parlorCollection);
    return parlorSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error('雀荘一覧の取得に失敗しました');
  }
};

export const getParlorDetailWithRooms = async (parlorId: string) => {
  try {
    const parlorRef = doc(db, 'parlors', parlorId);
    const parlorDoc = await getDoc(parlorRef);

    if (!parlorDoc.exists()) {
      throw new Error('雀荘が見つかりません');
    }

    const roomsSnapshot = await getDocs(collection(parlorRef, 'rooms'));

    const rooms = roomsSnapshot.docs.map((roomDoc) => ({
      id: roomDoc.id,
      ...roomDoc.data(),
    }));

    return {
      id: parlorDoc.id,
      ...parlorDoc.data(),
      rooms,
    };
  } catch (error) {
    throw new Error('雀荘詳細の取得に失敗しました');
  }
};

export const getAllParlorsWithRoomsCount = async () => {
  try {
    const parlorCollection = collection(db, 'parlors');
    const parlorSnapshot = await getDocs(parlorCollection);

    const parlorsWithCounts = await Promise.all(
      parlorSnapshot.docs.map(async (parlorDoc) => {
        const roomsSnapshot = await getDocs(
          collection(db, 'parlors', parlorDoc.id, 'rooms')
        );

        return {
          id: parlorDoc.id,
          roomsCount: roomsSnapshot.size,
          ...parlorDoc.data(),
        };
      })
    );

    return parlorsWithCounts;
  } catch (error) {
    throw new Error('雀荘一覧の取得に失敗しました');
  }
};

// Error message helper
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません';
    case 'auth/wrong-password':
      return 'パスワードが間違っています';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています';
    case 'auth/weak-password':
      return 'パスワードが弱すぎます（6文字以上で入力してください）';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません';
    case 'auth/too-many-requests':
      return '試行回数が多すぎます。しばらく時間をおいてから再度お試しください';
    default:
      return '認証エラーが発生しました';
  }
};
