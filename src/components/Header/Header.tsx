import { ReactNode } from "react";

import { cn } from "~/lib/utils";

export function Header({
  logoHref,
  actions,
  mobileMenu,
  className,
}: {
  logoHref?: string;
  actions: ReactNode;
  mobileMenu?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky left-0 right-0 top-0 bg-white z-50 print:hidden",
        className,
      )}
    >
      <div className="container flex justify-between items-center gap-4 py-4">
        <a href={logoHref ? logoHref : "/"} className="title-16 text-yellow-11">
          <img src="/images/mietencheck-logo.svg" alt="Mietencheck Logo" />
        </a>
        <nav className="flex flex-row gap-3">{actions}</nav>
      </div>
      {mobileMenu}
    </header>
  );
}
