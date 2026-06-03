import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";
import { getDatabase, ref, get, onValue, set, type Database, type Unsubscribe } from "firebase/database";
import type { UserProfile } from "@/types/catalog";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;

if (hasFirebaseConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
}

export { auth, db, hasFirebaseConfig };

export const googleProvider = auth ? new GoogleAuthProvider() : null;

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error("Firebase is not configured yet.");
  }

  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    const shouldUseRedirect = [
      "auth/cancelled-popup-request",
      "auth/operation-not-supported-in-this-environment",
      "auth/popup-blocked",
      "auth/popup-closed-by-user",
    ].includes(code);

    if (!shouldUseRedirect) {
      throw error;
    }

    await signInWithRedirect(auth, googleProvider);
  }
};

export const createRecaptcha = (containerId: string) => {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
};

export const requestPhoneLogin = async (
  phoneNumber: string,
  verifier: RecaptchaVerifier,
): Promise<ConfirmationResult> => {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  return signInWithPhoneNumber(auth, phoneNumber, verifier);
};

export const saveUserProfile = async (uid: string, profile: UserProfile) => {
  if (!db) {
    throw new Error("Firebase Realtime Database is not configured yet.");
  }

  await set(ref(db, `users/${uid}/profile`), profile);
};

export const loadUserProfile = async (uid: string) => {
  if (!db) return null;

  const [profileSnapshot, legacySnapshot] = await Promise.all([
    get(ref(db, `users/${uid}/profile`)),
    get(ref(db, `users/${uid}`)),
  ]);

  if (profileSnapshot.exists()) {
    return profileSnapshot.val() as UserProfile;
  }

  if (!legacySnapshot.exists()) return null;

  const value = legacySnapshot.val() as Partial<UserProfile>;
  return Array.isArray(value.addresses) && typeof value.displayName === "string"
    ? (value as UserProfile)
    : null;
};

export const saveActiveUserSession = async (uid: string, sessionId: string) => {
  if (!db) {
    throw new Error("Firebase Realtime Database is not configured yet.");
  }

  await set(ref(db, `users/${uid}/activeSessionId`), sessionId);
};

export const subscribeActiveUserSession = (
  uid: string,
  callback: (sessionId: string | null) => void,
): Unsubscribe => {
  if (!db) return () => undefined;

  return onValue(ref(db, `users/${uid}/activeSessionId`), (snapshot) => {
    const value = snapshot.val();
    callback(typeof value === "string" ? value : null);
  });
};
