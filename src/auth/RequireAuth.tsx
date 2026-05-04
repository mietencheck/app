import { ReactNode, useEffect } from "react";

import { useAuth } from "./AuthContext";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { getValidToken } = useAuth();
  const token = getValidToken();

  useEffect(() => {
    if (!getValidToken()) {
      const next = encodeURIComponent(
        `${window.location.pathname}${window.location.search}`,
      );
      window.location.assign(`/login?next=${next}`);
    }
  }, [getValidToken]);

  if (!token) {
    return (
      <main className="container py-8">
        <p className="text-sm text-neutral-faded">Weiterleitung…</p>
      </main>
    );
  }

  return <>{children}</>;
}
