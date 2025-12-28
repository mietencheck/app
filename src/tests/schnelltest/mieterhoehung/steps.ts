import { expect } from "@playwright/test";

import { createDescriptors, StepParams, StepRunner } from "../../utils/steps";

export const steps = {
  gotoSchnelltest: async ({ page }: StepParams<void>) => {
    await page.goto("/schnelltest");
  },
  typ: async ({ page, data }: StepParams<{ option: string }>) => {
    await expect(page.getByText("Was möchtest du überprüfen?")).toBeVisible();
    const option = data?.option ?? "Mieterhöhung";
    await page.locator("label").filter({ hasText: option }).click();
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  adresse: async ({
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
  datumMieterhoehungsschreiben: async ({
    page,
    data,
  }: StepParams<{ date: string }>) => {
    const today = new Date();
    const date = data?.date ?? today.toISOString().slice(0, 10);

    await expect(
      page.getByText(
        "An welchem Datum hast du das Schreiben zur Mieterhöhung erhalten?",
      ),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "An welchem Datum hast du das" })
      .fill(date);
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  fillMieterhoehungZugestimmt: async ({
    page,
    data,
  }: StepParams<{ option: "Ja" | "Nein" }>) => {
    const option = data?.option ?? "Nein";

    await expect(
      page.getByText("Hast du der Mieterhöhung bereits zugestimmt?"),
    ).toBeVisible();
    await page.locator("label").filter({ hasText: option }).click();
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  fillMietart: async ({
    page,
    data,
  }: StepParams<{
    option: "Staffelmiete" | "Indexmiete" | "Keins von beiden";
  }>) => {
    const option = data?.option ?? "Keins von beiden";

    await expect(
      page.getByText(
        "Ist im Mietvertrag eine Staffelmiete oder Indexmiete vereinbart?",
      ),
    ).toBeVisible();
    await page.locator("label").filter({ hasText: option }).click();
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  fillMieterhoehungGrund: async ({
    page,
    data,
  }: StepParams<{
    option:
      | "Mietspiegel, Vergleichsmieten oder § 558 BGB"
      | "Modernisierung oder bauliche Maßnahmen"
      | "Erhöhung der Betriebskosten"
      | "Keine der Optionen";
  }>) => {
    const option =
      data?.option ?? "Mietspiegel, Vergleichsmieten oder § 558 BGB";

    await expect(
      page.getByText(
        "Welche Gründe für die Mieterhöhung hat der Vermieter im Schreiben angeführt?",
      ),
    ).toBeVisible();
    await page.locator("label").filter({ hasText: option }).click();
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  fillAusgangsmiete: async ({
    page,
    data,
  }: StepParams<{
    value: string;
  }>) => {
    const value = data?.value ?? "1000";

    await expect(
      page.getByText(
        "Wie hoch ist die bisherige Nettokaltmiete pro Monat in Euro?",
      ),
    ).toBeVisible();
    await page
      .getByRole("spinbutton", { name: "Wie hoch ist die bisherige" })
      .fill(value);
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  fillGeforderteNettokaltmiete: async ({
    page,
    data,
  }: StepParams<{ value: string }>) => {
    const value = data?.value ?? "1100";

    await expect(
      page.getByText(
        "Wie hoch ist Nettokaltmiete pro Monat, welche der Vermieter zukünftig fordert?",
      ),
    ).toBeVisible();

    await page
      .getByRole("spinbutton", { name: "Wie hoch ist Nettokaltmiete" })
      .fill(value);
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
  fillMieterhoehungInnerhalbVon3Jahren: async ({
    page,
    data,
  }: StepParams<{ option: "Ja" | "Nein" }>) => {
    const option = data?.option ?? "Ja";

    await expect(page.getByText("Text")).toBeVisible();
    await page.locator("label").filter({ hasText: option }).click();
    await page.getByRole("button", { name: "Nächste Frage" }).click();
  },
} satisfies Record<string, StepRunner<any>>;

export type StepName = keyof typeof steps;
export type StepDataMap = {
  [K in StepName]: Parameters<(typeof steps)[K]>[0]["data"];
};
export type StepContext<Name extends StepName> = Parameters<
  (typeof steps)[Name]
>[0];
export type StepRunnerByName<Name extends StepName> = (typeof steps)[Name];

export const step = createDescriptors(steps);
