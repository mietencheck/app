import { expect, test } from "@playwright/test";

import { Flow } from "../../utils/flowBuilder";
import { step } from "./steps";

test.describe("Mieterhöhung Schnelltest", () => {
  test("Exit: Mieterhöhung zugestimmt", async ({ page }) => {
    await new Flow(page)
      .use(step.gotoSchnelltest)
      .use(step.fillTyp)
      .use(step.fillAdresse)
      .use(step.fillDatumMieterhoehungsschreiben)
      .use(step.fillMieterhoehungZugestimmt)
      .run();

    await expect(
      page.getByText(
        "Leider können wir dir nicht weiterhelfen, weil du der Mieterhöhung bereits zugestimmt hast.",
      ),
    ).toBeVisible();
  });
});
