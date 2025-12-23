import { Page } from "@playwright/test";

export type StepParams<Data> = {
  page: Page;
  data?: Data;
};

export type StepRunner<Data> = (ctx: StepParams<Data>) => Promise<void>;

export const createDescriptors = <
  T extends Record<string, (...args: any[]) => any>,
>(
  defs: T,
) => {
  const descriptors = {} as {
    [K in keyof T]: { name: K; run: T[K] };
  };
  (Object.keys(defs) as Array<keyof T>).forEach((key) => {
    descriptors[key] = { name: key, run: defs[key] };
  });
  return descriptors;
};
