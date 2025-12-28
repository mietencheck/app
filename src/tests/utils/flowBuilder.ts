import { Page } from "@playwright/test";

import { StepRunner } from "./steps";

type FlowStep<Data = void> = {
  step: StepRunner<Data>;
  data: Data;
};

export class Flow {
  private sequence: FlowStep<any>[] = [];

  constructor(private page: Page) {}

  use<Data = void>(step: StepRunner<Data>, data: Data): this {
    this.sequence.push({ step, data });
    return this;
  }

  async run() {
    for (const { step, data } of this.sequence) {
      await step({ page: this.page, data });
    }
  }
}
