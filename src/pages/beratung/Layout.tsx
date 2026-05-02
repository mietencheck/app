import { ReactNode } from "react";

import { useAuth } from "~/auth/AuthContext";
import { Button } from "~/components";

export function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();

  return (
    <>
      <header className="border-b border-gray-6 shadow">
        <div className="container flex items-center justify-between py-4">
          <a href="/beratung" className="text-base-medium">
            Beratung
          </a>
          <Button size="sm" onPress={logout}>
            Abmelden
          </Button>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </>
  );
}
