"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  auth,
  hasFirebaseConfig,
  loadUserProfile,
  saveUserProfile,
  signInWithGoogle,
} from "@/lib/firebase";
import type { Address, UserProfile } from "@/types/catalog";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveProfilePhoto: (file: File) => Promise<void>;
  saveAddresses: (addresses: Address[]) => Promise<void>;
  authEnabled: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(hasFirebaseConfig);

  useEffect(() => {
    if (!auth) return;

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const existingProfile = await loadUserProfile(nextUser.uid);
        const fallbackProfile: UserProfile = existingProfile ?? {
          displayName: nextUser.displayName ?? "LUMES Customer",
          email: nextUser.email ?? "",
          phoneNumber: nextUser.phoneNumber ?? "",
          addresses: [],
        };

        setProfile(fallbackProfile);
        if (!existingProfile) {
          await saveUserProfile(nextUser.uid, fallbackProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      authEnabled: hasFirebaseConfig,
      loginWithGoogle: async () => {
        await signInWithGoogle();
      },
      logout: async () => {
        if (!auth) return;
        await signOut(auth);
      },
      saveProfilePhoto: async (file) => {
        if (!user || !profile) return;
        if (file.type !== "image/jpeg" || file.size > 200 * 1024) {
          throw new Error("Profile photo must be a JPG and no larger than 200 KB.");
        }

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const nextProfile = { ...profile, photoDataUrl: dataUrl };
        setProfile(nextProfile);
        await saveUserProfile(user.uid, nextProfile);
      },
      saveAddresses: async (addresses) => {
        if (!user || !profile) return;
        const trimmed = addresses.slice(0, 3);
        const nextProfile = { ...profile, addresses: trimmed };
        setProfile(nextProfile);
        await saveUserProfile(user.uid, nextProfile);
      },
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
