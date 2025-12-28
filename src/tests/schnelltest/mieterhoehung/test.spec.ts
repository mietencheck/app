import { expect, test } from "@playwright/test";

import { Flow } from "../../utils/flowBuilder";
import { StepParams } from "../../utils/steps";

const gotoSchnelltest = async ({ page }: StepParams<void>) => {
  await page.goto("/schnelltest");
};

const typ = async ({ page, data }: StepParams<{ option: string }>) => {
  await expect(page.getByText("Was möchtest du überprüfen?")).toBeVisible();
  const option = data?.option ?? "Mieterhöhung";
  await page.locator("label").filter({ hasText: option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const adresse = async ({
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

const datumMieterhoehungsschreiben = async ({
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
};

const fillMieterhoehungZugestimmt = async ({
  page,
  data,
}: StepParams<{ option: "Ja" | "Nein" }>) => {
  const option = data?.option ?? "Nein";

  await expect(
    page.getByText("Hast du der Mieterhöhung bereits zugestimmt?"),
  ).toBeVisible();
  await page.locator("label").filter({ hasText: option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const fillMietart = async ({
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
};

const fillMieterhoehungGrund = async ({
  page,
  data,
}: StepParams<{
  option:
    | "Mietspiegel, Vergleichsmieten oder § 558 BGB"
    | "Modernisierung oder bauliche Maßnahmen"
    | "Erhöhung der Betriebskosten"
    | "Keine der Optionen";
}>) => {
  const option = data?.option ?? "Mietspiegel, Vergleichsmieten oder § 558 BGB";

  await expect(
    page.getByText(
      "Welche Gründe für die Mieterhöhung hat der Vermieter im Schreiben angeführt?",
    ),
  ).toBeVisible();
  await page.locator("label").filter({ hasText: option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const ausgangsmiete = async ({
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
};

const geforderteNettokaltmiete = async ({
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
};

/*const mieterhoehungInnerhalbVon3Jahren = async ({
  page,
  data,
}: StepParams<{ option: "Ja" | "Nein" }>) => {
  const option = data?.option ?? "Ja";

  await expect(page.getByText("Text")).toBeVisible();
  await page.locator("label").filter({ hasText: option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};*/

test.describe("Mieterhöhung Schnelltest", () => {
  /*test("Exit: Mieterhöhung zugestimmt", async ({ page }) => {
    await new Flow(page)
      .use(gotoSchnelltest)
      .use(typ)
      .use(adresse)
      .use(datumMieterhoehungsschreiben)
      .use(fillMieterhoehungZugestimmt)
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
      .use(gotoSchnelltest)
      .use(typ)
      .use(adresse)
      .use(datumMieterhoehungsschreiben)
      .use(fillMieterhoehungZugestimmt)
      .use(fillMietart)
      .use(fillMieterhoehungGrund)
      .use(ausgangsmiete, { value: "900" })
      .use(geforderteNettokaltmiete, { value: "1100" })
      .run();

    await expect(page.getByText("Foobar")).toBeVisible();
  });
});
