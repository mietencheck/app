import { ReactNode } from "react";

import { useAuth } from "~/auth/AuthContext";
import { Button } from "~/components";

export function Layout({
  children,
  headerTrailing,
}: {
  children: ReactNode;
  headerTrailing?: ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <>
      <header className="border-b border-gray-6 shadow">
        <div className="container flex items-center justify-between py-4">
          <a href="/beratung" className="text-base-medium">
            Beratung
          </a>
          <div className="flex items-center gap-2">
            {headerTrailing}
            <Button
              variant="outline"
              color="gray"
              size="sm"
              type="button"
              onClick={logout}
            >
              Abmelden
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </>
  );
}
