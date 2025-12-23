import { expect } from "@playwright/test";

import { createDescriptors, StepParams, StepRunner } from "../../utils/steps";

export const actions = {
  gotoSchnelltest: async ({ page }: StepParams<void>) => {
    await page.goto("/schnelltest");
  },
  fillTyp: async ({ page, data }: StepParams<{ option: string }>) => {
    await expect(page.getByText("Was möchtest du überprüfen?")).toBeVisible();
    const option = data?.option ?? "Miete für aktuelle oder neue Wohnung";
    await page.locator("label").filter({ hasText: option }).click();
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  fillAdresse: async ({
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
  },
  fillMietvertragUnterschrieben: async ({
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
  },
} satisfies Record<string, StepRunner<any>>;

export type StepName = keyof typeof actions;
export const steps = createDescriptors(actions);
