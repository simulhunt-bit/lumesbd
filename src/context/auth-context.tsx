"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  auth,
  hasFirebaseConfig,
  loadUserProfile,
  saveActiveUserSession,
  saveUserProfile,
  signInWithGoogle,
  subscribeActiveUserSession,
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
const sessionStartedAtKey = "lumes-session-started-at";
const sessionDeviceIdKey = "lumes-session-device-id";
const pendingLoginSessionKey = "lumes-pending-login-session";
const profileCacheKeyPrefix = "lumes-profile-cache";
const sessionDurationMs = 2 * 24 * 60 * 60 * 1000;
const profileLoadTimeoutMs = 4_000;

const readSessionStartedAt = () => {
  const value = window.localStorage.getItem(sessionStartedAtKey);
  const startedAt = value ? Number(value) : NaN;
  return Number.isFinite(startedAt) ? startedAt : null;
};

const startSession = () => {
  window.localStorage.setItem(sessionStartedAtKey, String(Date.now()));
};

const clearSession = () => {
  window.localStorage.removeItem(sessionStartedAtKey);
};

const getDeviceSessionId = () => {
  const existing = window.localStorage.getItem(sessionDeviceIdKey);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(sessionDeviceIdKey, next);
  return next;
};

const markPendingLogin = () => {
  window.localStorage.setItem(pendingLoginSessionKey, "1");
};

const consumePendingLogin = () => {
  const pending = window.localStorage.getItem(pendingLoginSessionKey) === "1";
  window.localStorage.removeItem(pendingLoginSessionKey);
  return pending;
};

const isSessionExpired = (startedAt: number) => Date.now() - startedAt >= sessionDurationMs;

const getProfileCacheKey = (uid: string) => `${profileCacheKeyPrefix}:${uid}`;

const isUserProfile = (value: unknown): value is UserProfile => {
  if (!value || typeof value !== "object") return false;

  const profile = value as Partial<UserProfile>;
  return (
    typeof profile.displayName === "string" &&
    typeof profile.email === "string" &&
    Array.isArray(profile.addresses)
  );
};

const readCachedUserProfile = (uid: string) => {
  try {
    const value = window.localStorage.getItem(getProfileCacheKey(uid));
    if (!value) return null;

    const profile = JSON.parse(value) as unknown;
    return isUserProfile(profile) ? profile : null;
  } catch {
    return null;
  }
};

const cacheUserProfile = (uid: string, profile: UserProfile) => {
  try {
    window.localStorage.setItem(getProfileCacheKey(uid), JSON.stringify(profile));
  } catch {
    // Storage can fail in private browsing or when a profile photo is too large.
  }
};

const createFallbackProfile = (user: User): UserProfile => ({
  displayName: user.displayName ?? "LUMES Customer",
  email: user.email ?? "",
  phoneNumber: user.phoneNumber ?? "",
  addresses: [],
});

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Profile data request timed out.")), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const getSafeNextPath = () => {
  const path = `${window.location.pathname}${window.location.search}`;
  if (!path || path === "/login") return "/dashboard";

  if (window.location.pathname === "/login") {
    const nextPath = new URLSearchParams(window.location.search).get("next");
    return nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";
  }

  return path;
};

const getExpiredLoginPath = () => {
  const params = new URLSearchParams({
    expired: "1",
    next: getSafeNextPath(),
  });

  return `/login?${params.toString()}`;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(hasFirebaseConfig);

  useEffect(() => {
    if (!auth) return;
    const currentAuth = auth;
    let cancelled = false;

    const unsubscribeAuth = onAuthStateChanged(currentAuth, async (nextUser) => {
      if (nextUser) {
        const startedAt = readSessionStartedAt();
        if (startedAt && isSessionExpired(startedAt)) {
          clearSession();
          setUser(null);
          setProfile(null);
          setLoading(false);
          await signOut(currentAuth);
          router.replace(getExpiredLoginPath());
          return;
        }

        if (!startedAt) {
          startSession();
        }
        if (consumePendingLogin()) {
          saveActiveUserSession(nextUser.uid, getDeviceSessionId()).catch((error) => {
            console.error(error instanceof Error ? error.message : "Could not save active session.");
          });
        }

        const fallbackProfile = createFallbackProfile(nextUser);
        const cachedProfile = readCachedUserProfile(nextUser.uid);
        setUser(nextUser);
        setProfile(cachedProfile ?? fallbackProfile);
        setLoading(false);

        try {
          const existingProfile = await withTimeout(loadUserProfile(nextUser.uid), profileLoadTimeoutMs);
          if (cancelled || currentAuth.currentUser?.uid !== nextUser.uid) return;

          const nextProfile = existingProfile ?? cachedProfile ?? fallbackProfile;
          setProfile(nextProfile);
          cacheUserProfile(nextUser.uid, nextProfile);

          if (!existingProfile) {
            saveUserProfile(nextUser.uid, nextProfile).catch((error) => {
              console.error(error instanceof Error ? error.message : "Could not initialize profile.");
            });
          }
        } catch (error) {
          console.error(error instanceof Error ? error.message : "Could not load profile data.");
        }
      } else {
        clearSession();
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribeAuth();
    };
  }, [router]);

  useEffect(() => {
    if (!auth || !user) return;
    const currentAuth = auth;
    const deviceSessionId = getDeviceSessionId();

    const unsubscribeSession = subscribeActiveUserSession(user.uid, (activeSessionId) => {
      if (!activeSessionId || activeSessionId === deviceSessionId) return;

      void signOut(currentAuth).then(() => {
        clearSession();
        setUser(null);
        setProfile(null);
        router.replace("/login?next=/dashboard");
      });
    });

    const startedAt = readSessionStartedAt();
    if (!startedAt) {
      return unsubscribeSession;
    }

    const remainingMs = sessionDurationMs - (Date.now() - startedAt);
    if (remainingMs <= 0) {
      void signOut(currentAuth).then(() => {
        clearSession();
        router.replace(getExpiredLoginPath());
      });
      unsubscribeSession();
      return;
    }

    const timeout = window.setTimeout(() => {
      void signOut(currentAuth).then(() => {
        clearSession();
        router.replace(getExpiredLoginPath());
      });
    }, remainingMs);

    return () => {
      window.clearTimeout(timeout);
      unsubscribeSession();
    };
  }, [router, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      authEnabled: hasFirebaseConfig,
      loginWithGoogle: async () => {
        markPendingLogin();
        try {
          await signInWithGoogle();
          startSession();
          if (auth?.currentUser) {
            await saveActiveUserSession(auth.currentUser.uid, getDeviceSessionId());
          }
        } catch (error) {
          consumePendingLogin();
          throw error;
        }
      },
      logout: async () => {
        if (!auth) return;
        clearSession();
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
        cacheUserProfile(user.uid, nextProfile);
        await saveUserProfile(user.uid, nextProfile);
      },
      saveAddresses: async (addresses) => {
        if (!user || !profile) return;
        const trimmed = addresses.slice(0, 3);
        const nextProfile = { ...profile, addresses: trimmed };
        setProfile(nextProfile);
        cacheUserProfile(user.uid, nextProfile);
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
