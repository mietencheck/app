import { Page } from "@playwright/test";

import {
  step,
  StepContext,
  StepName,
  StepRunnerByName,
  steps,
} from "../schnelltest/mieterhoehung/steps";

type StepDescriptor = (typeof step)[StepName];

type FlowStep =
  | StepName
  | StepDescriptor
  | {
      name: StepName;
      data?: StepContext<StepName>["data"];
      fn?: StepRunnerByName<StepName>;
    };

export class Flow {
  private sequence: FlowStep[] = [];

  constructor(private page: Page) {}

  private async runStep<N extends StepName>(
    name: N,
    data: StepContext<N>["data"],
    fn?: StepRunnerByName<N>,
  ) {
    const runner = (fn ?? steps[name]) as (ctx: {
      page: Page;
      data?: unknown;
    }) => Promise<void>;
    await runner({ page: this.page, data });
  }

  use(step: FlowStep) {
    this.sequence.push(step);
    return this;
  }

  async run() {
    for (const entry of this.sequence) {
      if (typeof entry === "string") {
        await this.runStep(entry, undefined);
        continue;
      }

      if ("run" in entry) {
        await entry.run({ page: this.page });
        continue;
      }

      const { name, data, fn } = entry;
      await this.runStep(name, data, fn as StepRunnerByName<typeof name>);
    }
  }
}
