import { expect, test } from "@playwright/test";

import { Flow } from "../../utils/flowBuilder";
import { steps } from "./steps";

test.describe("Schnelltest aktuelle Miete", () => {
  test("Exit: Mieterhöhung zugestimmt", async ({ page }) => {
    await new Flow(page)
      .use(steps.gotoSchnelltest)
      .use(steps.fillTyp)
      .use(steps.fillAdresse)
      .use(steps.fillMietvertragUnterschrieben)
      .run();

    await expect(page.getByText("")).toBeVisible();
  });
});
