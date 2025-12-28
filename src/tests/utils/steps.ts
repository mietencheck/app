import { Page } from "@playwright/test";

export type StepParams<Data> = {
  page: Page;
  data: Data;
};

export type StepRunner<Data> = (ctx: StepParams<Data>) => Promise<void>;
