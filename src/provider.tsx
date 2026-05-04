import { pushUnsafe } from "@swan-io/chicane";
import { RouterProvider } from "react-aria-components";

import { AuthProvider } from "~/auth/AuthContext";
import { AnswersProvider, StepsProvider } from "~/form/flow-machine";

import { L10nPovider } from "./L10nContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnswersProvider>
        <StepsProvider>
          {/*
            React Aria `Link` calls `navigate(href)` with a path string.
            `AppRouter.push` only accepts typed route names + params, not raw URLs — use `pushUnsafe`.
          */}
          <RouterProvider navigate={pushUnsafe}>
            <L10nPovider>{children}</L10nPovider>
          </RouterProvider>
        </StepsProvider>
      </AnswersProvider>
    </AuthProvider>
  );
}
