import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type Auth, type User } from "firebase/auth";
import { collection, connectFirestoreEmulator, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNCPJ1Hc5WEUjmEWrNKvN6ejJEaxiX6lw",
  authDomain: "jansou-3138d.firebaseapp.com",
  projectId: "jansou-3138d",
  storageBucket: "jansou-3138d.firebasestorage.app",
  messagingSenderId: "565027363734",
  appId: "1:565027363734:web:63e1c2a0f1130c5d2edbb7",
  measurementId: "G-R9H6J5YH4P",
} as const;

// 【重要】サーバーサイドでの実行エラーを防ぐため、変数を初期化せずに宣言
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// 【重要】クライアントサイド（ブラウザ）でのみ初期化を実行
if (typeof window !== "undefined") {
  // 二重初期化を防ぐ（Singleton Pattern）
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);

  // Firestore Emulator (development) configuration
  if (process.env.NODE_ENV !== "production") {
    try {
      // エミュレーター接続は一度だけ試みる
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
    } catch {
      // エミュレーター未起動時や接続済みなどのエラーは無視
    }
  }
}

let analyticsPromise: Promise<Analytics | null> | null = null;

// export関数内でも undefined チェックを行うか、
// クライアント側でのみ呼び出されることを前提とします
export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => auth;
export const getFirebaseFirestore = () => db;

export const getFirebaseAnalytics = () => {
  if (typeof window === "undefined") return null;
  if (!app) return null;

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => {
        if (!supported) return null;
        return getAnalytics(app!);
      })
      .catch(() => null);
  }

  return analyticsPromise;
};

interface AuthParlor {
  id: string;
  name?: string;
  [key: string]: any;
}

// Auth functions
export const signInParlor = async (
  email: string,
  password: string
): Promise<{ user: User; parlor: AuthParlor }> => {
  if (!auth || !db) throw new Error("Firebase SDKが初期化されていません（ブラウザ環境で実行してください）");

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
      parlor: { id: parlorDoc.id, ...parlorDoc.data() } as AuthParlor
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
  if (!auth || !db) throw new Error("Firebase SDKが初期化されていません");

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
  if (!auth) throw new Error("Firebase SDKが初期化されていません");

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const signOutParlor = async () => {
  if (!auth) throw new Error("Firebase SDKが初期化されていません");

  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('ログアウトに失敗しました');
  }
};

// Firestore functions
export const updateParlorRooms = async (parlorId: string, rooms: any[]) => {
  if (!db) throw new Error("Firebase SDKが初期化されていません");

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
  if (!db) throw new Error("Firebase SDKが初期化されていません");

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
  if (!db) throw new Error("Firebase SDKが初期化されていません");

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
  if (!db) throw new Error("Firebase SDKが初期化されていません");

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
  if (!db) throw new Error("Firebase SDKが初期化されていません");

  try {
    const parlorCollection = collection(db, 'parlors');
    const parlorSnapshot = await getDocs(parlorCollection);

    const parlorsWithCounts = await Promise.all(
      parlorSnapshot.docs.map(async (parlorDoc) => {
        // ※注意: サブコレクションの全取得は読み取り数が増えるため、本来は集計フィールドを作るのがベストです
        const roomsSnapshot = await getDocs(
          collection(db!, 'parlors', parlorDoc.id, 'rooms')
        );

        const hasAvailableRooms = roomsSnapshot.docs.some(
          (doc) => doc.data().can_play_immediately === true
        );

        return {
          id: parlorDoc.id,
          roomsCount: roomsSnapshot.size,
          hasAvailableRooms,
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
