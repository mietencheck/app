import { expect, test } from "@playwright/test";

import { Flow, withData } from "../../utils/flowBuilder";
import { step } from "./steps";

test.describe("Mieterhöhung Schnelltest", () => {
  /*test("Exit: Mieterhöhung zugestimmt", async ({ page }) => {
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
  });*/

  test("Exit: Kappungsgrenze durch vorherige Mietspiegel Mieterhöhungen überschritten", async ({
    page,
  }) => {
    await new Flow(page)
      .use(step.gotoSchnelltest)
      .use(step.typ)
      .use(step.adresse)
      .use(step.datumMieterhoehungsschreiben)
      .use(step.fillMieterhoehungZugestimmt)
      .use(step.fillMietart)
      .use(step.fillMieterhoehungGrund)
      .use(withData(step.fillAusgangsmiete, { value: "900" }))
      .use(withData(step.fillGeforderteNettokaltmiete, { value: "1100" }))
      .run();

    await expect(page.getByText("Foobar")).toBeVisible();
  });
});
