import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { postAuthLogin } from "~/api/mietencheck-backend";

const STORAGE_TOKEN = "mietencheck_api_token";
const STORAGE_EXPIRES_AT = "mietencheck_api_token_expires_at";

/** Client session: how long we keep the token in sessionStorage (1 day). */
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

type AuthContextValue = {
  /** Clears session; use after 401 or explicit sign-out. */
  logout: () => void;
  /** Persists token and returns. */
  login: (email: string, password: string) => Promise<void>;
  /** Returns null if missing or expired. */
  getValidToken: () => string | null;
  /** `true` when a non-expired token is in session. */
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readExpiresAt(): number | null {
  const store = getSessionStorage();
  if (!store) return null;
  const raw = store.getItem(STORAGE_EXPIRES_AT);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function readTokenFromStorage(): string | null {
  return getSessionStorage()?.getItem(STORAGE_TOKEN) ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);

  const getValidToken = useCallback((): string | null => {
    const store = getSessionStorage();
    const token = readTokenFromStorage();
    const exp = readExpiresAt();
    if (!token || exp == null || Date.now() >= exp) {
      if (token && store) {
        store.removeItem(STORAGE_TOKEN);
        store.removeItem(STORAGE_EXPIRES_AT);
        setVersion((v) => v + 1);
      }
      return null;
    }
    return token;
  }, []);

  const logout = useCallback(() => {
    const store = getSessionStorage();
    if (store) {
      store.removeItem(STORAGE_TOKEN);
      store.removeItem(STORAGE_EXPIRES_AT);
    }
    setVersion((v) => v + 1);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await postAuthLogin({ email, password });
    const store = getSessionStorage();
    if (!store) return;
    store.setItem(STORAGE_TOKEN, access_token);
    store.setItem(STORAGE_EXPIRES_AT, String(Date.now() + TOKEN_TTL_MS));
    setVersion((v) => v + 1);
  }, []);

  const isAuthenticated = useMemo(() => {
    void version;
    return getValidToken() != null;
  }, [version, getValidToken]);

  const value = useMemo(
    () =>
      ({
        login,
        logout,
        getValidToken,
        isAuthenticated,
      }) satisfies AuthContextValue,
    [login, logout, getValidToken, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* eslint-disable react-refresh/only-export-components -- hook colocated with AuthProvider */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
