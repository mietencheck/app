import { expect, test } from "@playwright/test";

import { Flow } from "../../utils/flowBuilder";
import { StepParams } from "../../utils/steps";

const gotoSchnelltest = async ({ page }: StepParams<void>) => {
  await page.goto("/schnelltest");
};

const fillTyp = async ({ page, data }: StepParams<{ option: string }>) => {
  await expect(page.getByText("Was möchtest du überprüfen?")).toBeVisible();
  const option = data?.option ?? "Miete für aktuelle oder neue Wohnung";
  await page.locator("label").filter({ hasText: option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const fillAdresse = async ({
  page,
  data,
}: StepParams<{ strasse: string; hausnummer: string; plz: string }>) => {
  const strasse = data?.strasse ?? "Weichselstraße";
  const hausnummer = data?.hausnummer ?? "7";
  const plz = data?.plz ?? "12043";

  await expect(
    page.getByText("Wie lautet die Adresse der Wohnung?"),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Wie lautet die Adresse der" })
    .fill(strasse);
  await page.locator('[id="downshift-:rj:-input"]').fill(hausnummer);
  await page.locator('[id="downshift-:rl:-input"]').fill(plz);
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const fillMietvertragUnterschrieben = async ({
  page,
  data,
}: StepParams<{ option: string }>) => {
  await expect(
    page.getByText(
      "Hast du den Mietvertrag für die Wohnung bereits unterschrieben?",
    ),
  ).toBeVisible();
  const option = data?.option ?? "Ja";
  await page.locator("label").filter({ hasText: option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

test.describe("Schnelltest aktuelle Miete", () => {
  test("Exit: Foo", async ({ page }) => {
    await new Flow(page)
      .use(gotoSchnelltest)
      .use(fillTyp)
      .use(fillAdresse)
      .use(fillMietvertragUnterschrieben)
      .run();

    //await expect(page.getByText("")).toBeVisible();
  });
});
