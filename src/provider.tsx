import { RouterProvider } from "react-aria-components";

import { AnswersProvider, StepsProvider } from "./form/flow-machine";
import { L10nPovider } from "./L10nContext";
import { AppRouter } from "./router";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnswersProvider>
      <StepsProvider>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <RouterProvider navigate={(path) => AppRouter.push(path as any)}>
          <L10nPovider>{children}</L10nPovider>
        </RouterProvider>
      </StepsProvider>
    </AnswersProvider>
  );
}
