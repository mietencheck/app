import { ReactNode } from "react";

import { BeratungHeader } from "~/components/Header";

export function Layout({
  children,
  headerTrailing,
}: {
  children: ReactNode;
  headerTrailing?: ReactNode;
}) {
  return (
    <>
      <BeratungHeader trailing={headerTrailing} />
      <main className="container py-6">{children}</main>
    </>
  );
}
