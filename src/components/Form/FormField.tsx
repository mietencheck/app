import { ReactNode } from "react";

export function FormField({ children }: { children: ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}
