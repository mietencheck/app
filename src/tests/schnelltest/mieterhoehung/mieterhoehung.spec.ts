import { expect, test } from "@playwright/test";

import { Flow } from "../../utils/flowBuilder";
import { StepParams } from "../../utils/steps";

const ADRESSE = {
  strasse: "Weichselstraße",
  hausnummer: "1",
  plz: "12043",
};

const DATE = new Date().toISOString().slice(0, 10);

const link = async ({
  page,
  data,
}: StepParams<{
  url: string;
}>) => {
  await page.goto(data.url);
};

const typ = async ({
  page,
  data,
}: StepParams<{
  option: "Miete für aktuelle oder neue Wohnung" | "Mieterhöhung";
}>) => {
  const option = data?.option ?? "Mieterhöhung";

  await expect(page.getByText("Was möchtest du überprüfen?")).toBeVisible();
  await page.locator("label").filter({ hasText: option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const adresse = async ({
  page,
  data,
}: StepParams<{ strasse: string; hausnummer: string; plz: string }>) => {
  await expect(
    page.getByText("Wie lautet die Adresse der Wohnung?"),
  ).toBeVisible();

  await page
    .getByRole("combobox", { name: "Wie lautet die Adresse der" })
    .fill(data.strasse);
  await page.locator('[id="downshift-:rj:-input"]').fill(data.hausnummer);
  await page.locator('[id="downshift-:rl:-input"]').fill(data.plz);
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const datumMieterhoehungsschreiben = async ({
  page,
  data,
}: StepParams<{ date: string }>) => {
  await expect(
    page.getByText(
      "An welchem Datum hast du das Schreiben zur Mieterhöhung erhalten?",
    ),
  ).toBeVisible();

  await page
    .getByRole("textbox", { name: "An welchem Datum hast du das" })
    .fill(data.date);
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const mieterhoehungZugestimmt = async ({
  page,
  data,
}: StepParams<{ option: "Ja" | "Nein" }>) => {
  await expect(
    page.getByText("Hast du der Mieterhöhung bereits zugestimmt?"),
  ).toBeVisible();

  await page.locator("label").filter({ hasText: data.option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const mietart = async ({
  page,
  data,
}: StepParams<{
  option: "Staffelmiete" | "Indexmiete" | "Keins von beiden";
}>) => {
  await expect(
    page.getByText(
      "Ist im Mietvertrag eine Staffelmiete oder Indexmiete vereinbart?",
    ),
  ).toBeVisible();

  await page.locator("label").filter({ hasText: data.option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const mieterhoehungGrund = async ({
  page,
  data,
}: StepParams<{
  option:
    | "Mietspiegel, Vergleichsmieten oder § 558 BGB"
    | "Modernisierung oder bauliche Maßnahmen"
    | "Erhöhung der Betriebskosten"
    | "Keine der Optionen";
}>) => {
  await expect(
    page.getByText(
      "Welche Gründe für die Mieterhöhung hat der Vermieter im Schreiben angeführt?",
    ),
  ).toBeVisible();

  await page.locator("label").filter({ hasText: data.option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const ausgangsmiete = async ({
  page,
  data,
}: StepParams<{
  value: string;
}>) => {
  await expect(
    page.getByText(
      "Wie hoch ist die bisherige Nettokaltmiete pro Monat in Euro?",
    ),
  ).toBeVisible();

  await page
    .getByRole("spinbutton", { name: "Wie hoch ist die bisherige" })
    .fill(data.value);
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const geforderteNettokaltmiete = async ({
  page,
  data,
}: StepParams<{ value: string }>) => {
  await expect(
    page.getByText(
      "Wie hoch ist Nettokaltmiete pro Monat, welche der Vermieter zukünftig fordert?",
    ),
  ).toBeVisible();

  await page
    .getByRole("spinbutton", { name: "Wie hoch ist Nettokaltmiete" })
    .fill(data.value);
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const mieterhoehungInnerhalbVon3Jahren = async ({
  page,
  data,
}: StepParams<{
  option:
    | "Ja, die Miete wurde in dieser Zeit bereits erhöht"
    | "Nein, die Miete wurde in dieser Zeit noch nicht erhöht";
}>) => {
  await expect(
    page.getByText(
      /Ist die Miete seit dem \d+\.\d+\.\d+ bereits schon einmal erhöht worden\?/,
    ),
  ).toBeVisible();

  await page.locator("label").filter({ hasText: data.option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const nettokaltmieteVor33Monaten = async ({
  page,
  data,
}: StepParams<{ value: string }>) => {
  await expect(
    page.getByText(/Wie hoch war deine Nettokaltmiete im .+/),
  ).toBeVisible();

  await page
    .getByRole("spinbutton", { name: "Wie hoch war deine" })
    .fill(data.value);
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

const bisherigeMieterhoehungGrund = async ({
  page,
  data,
}: StepParams<{
  option:
    | "Mietspiegel, Vergleichsmieten oder § 558 BGB"
    | "Modernisierung oder bauliche Maßnahmen"
    | "Freiwillige Mieterhöhung";
}>) => {
  await expect(
    page.getByText(
      "Welche Begründungen wurden in der Mieterhöhung bzw. den Mieterhöhungen angegeben?",
    ),
  ).toBeVisible();

  await page.locator("label").filter({ hasText: data.option }).click();
  await page.getByRole("button", { name: "Nächste Frage" }).click();
};

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
      .use(link, { url: "/schnelltest" })
      .use(typ, { option: "Mieterhöhung" })
      .use(adresse, ADRESSE)
      .use(datumMieterhoehungsschreiben, {
        date: DATE,
      })
      .use(mieterhoehungZugestimmt, { option: "Nein" })
      .use(mietart, { option: "Keins von beiden" })
      .use(mieterhoehungGrund, {
        option: "Mietspiegel, Vergleichsmieten oder § 558 BGB",
      })
      .use(ausgangsmiete, { value: "500" })
      .use(geforderteNettokaltmiete, { value: "1000" })
      .use(mieterhoehungInnerhalbVon3Jahren, {
        option: "Ja, die Miete wurde in dieser Zeit bereits erhöht",
      })
      .use(nettokaltmieteVor33Monaten, { value: "0" })
      .use(bisherigeMieterhoehungGrund, {
        option: "Mietspiegel, Vergleichsmieten oder § 558 BGB",
      })
      .run();

    await expect(
      page.getByText(
        "Die Mieterhöhung ist wahrscheinlich nicht rechtmäßig, da die Kappungsgrenze überschritten wurde.",
      ),
    ).toBeVisible();
  });
});
