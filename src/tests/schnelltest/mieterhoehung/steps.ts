import { expect, Page } from "@playwright/test";

type StepParams<Data> = {
  page: Page;
  data?: Data;
};

type StepRunner<Data> = (ctx: StepParams<Data>) => Promise<void>;

export const steps = {
  gotoSchnelltest: async ({ page }: StepParams<void>) => {
    await page.goto("/schnelltest");
  },
  fillTyp: async ({ page, data }: StepParams<{ option: string }>) => {
    await expect(page.getByText("Was möchtest du überprüfen?")).toBeVisible();
    const option = data?.option ?? "Mieterhöhung";
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
  fillDatumMieterhoehungsschreiben: async ({
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
    const option = data?.option ?? "Ja";

    await expect(
      page.getByText("Hast du der Mieterhöhung bereits zugestimmt?"),
    ).toBeVisible();
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

const createDescriptors = <T extends Record<string, (...args: any[]) => any>>(
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

export const step = createDescriptors(steps);
