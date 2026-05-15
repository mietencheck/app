import { ReactNode } from "react";

import { useAuth } from "~/auth/AuthContext";
import { Button } from "~/components";

import { Header } from "./Header";

export function BeratungHeader({ trailing }: { trailing?: ReactNode }) {
  const { logout } = useAuth();

  return (
    <Header
      logoHref="/beratung"
      actions={
        <>
          <Button variant="outline" color="gray" onClick={logout}>
            Abmelden
          </Button>
          {trailing}
        </>
      }
    />
  );
}
