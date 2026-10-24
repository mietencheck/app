import { createRequire } from "node:module";

import { expect, test } from "@playwright/test";
import { FlowMachine } from "flow-machine";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../src/form/mappings/answer-reset";

const require = createRequire(import.meta.url);
const flowMachine = new FlowMachine(require("../src/form/flow.fm.json"));

function savedAnswers(uncertain = false) {
  return flowMachine.answers({
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Typ: "Miete",
    Unterschrieben: "Ja",
    Mietart: "Normal",
    Vertragsdatum: ">2026",
    "Vorherige Mieterhöhung": "Nein",
    Ausnahmen: [],
    Dachgeschoss: "Nein",
    "Baujahr vor 1991": "1919-1949",
    Baujahr: 1930,
    Wohnlage: "mittel",
    Ost: false,
    Qm: 60,
    Nettokaltmiete: 700,
    "Wohnung hat Sammelheizung": "Ja",
    "Badezimmer in Wohnung": "Ja",
    "Vermieter hat über Vormiete informiert": "Nein",
    "Vermieter hat über umfassende Sanierung informiert": "Nein",
    "Wohnung hat Balkon": "Ja",
    "Kennt Energieverbrauch oder Energiebedarf": "Nein",
    "Duschen nur in freistehender Badewanne": "Nein",
    "Gebäude hat Fahrstuhl": "Nein",
    "Bad mit Fußbodenheizung": uncertain ? "Nicht sicher" : "Ja",
    // Deliberately synthetic address: these tests verify consumption of resolved
    // Wohnlage data, not the correctness of the street directory itself.
    Adresse: JSON.stringify({
      plz: "10115",
      strasse: "Teststraße",
      nummer: "1",
      lage: { "2026": { wohnlage: "mittel", ost: false } },
    }),
  } as never).state;
}

for (const locale of ["de", "en"] as const) {
  test(`${locale}: source-backed 2026 result survives reload and shows monthly units`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ answers, locale }) => {
        if (!localStorage.getItem("mb-flow"))
          localStorage.setItem("mb-flow", JSON.stringify(answers));
        localStorage.setItem("locale", JSON.stringify(locale));
      },
      { answers: savedAnswers(), locale },
    );
    await page.goto("/fragebogen/auswertung");
    const open = page.getByRole("button", {
      name: locale === "de" ? "Auswertung ansehen" : "View details",
      exact: true,
    });
    await expect(open).toBeVisible();
    await open.click();
    const dialog = page.getByRole("dialog");
    const total = dialog
      .getByRole("row")
      .filter({
        hasText:
          locale === "de"
            ? "Zulässige Höchstmiete"
            : "Maximum permissible rent",
      })
      .filter({ hasText: "511,50" });
    await expect(total).toBeVisible();
    await expect(total).toContainText(
      locale === "de" ? "pro Monat" : "per month",
    );
    await expect(total).not.toContainText("m²");
    await page.reload();
    await expect(open).toBeVisible();
    await open.click();
    await expect(total).toBeVisible();
  });
}

test("uncertain answers display the reachable 481.80–511.50 EUR range", async ({
  page,
}) => {
  await page.addInitScript((answers) => {
    if (!localStorage.getItem("mb-flow"))
      localStorage.setItem("mb-flow", JSON.stringify(answers));
    localStorage.setItem("locale", JSON.stringify("de"));
  }, savedAnswers(true));
  await page.goto("/fragebogen/auswertung");
  await page
    .getByRole("button", { name: "Auswertung ansehen", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const text = await dialog.innerText();
  expect(text).toContain("481,80");
  expect(text).toContain("511,50");
  expect(text).toContain("Niedrigste Miete");
  expect(text).toContain("Höchste Miete");
});

test("changing a questionnaire answer updates the result and persists across reload", async ({
  page,
}) => {
  await page.addInitScript((answers) => {
    if (!localStorage.getItem("mb-flow"))
      localStorage.setItem("mb-flow", JSON.stringify(answers));
    localStorage.setItem("locale", JSON.stringify("de"));
  }, savedAnswers());
  await page.goto("/fragebogen/bad-u-wc");
  const question = page.getByRole("radiogroup", {
    name: "Gibt es ein Badezimmer mit Fußbodenheizung?",
    exact: true,
  });
  await question.getByText("Nein", { exact: true }).click();
  await expect(
    question.getByRole("radio", { name: "Nein", exact: true }),
  ).toBeChecked();
  await page.goto("/fragebogen/auswertung");
  await page
    .getByRole("button", { name: "Auswertung ansehen", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("481,80");
  await expect(page.getByRole("dialog")).not.toContainText("511,50");
  await page.reload();
  await page
    .getByRole("button", { name: "Auswertung ansehen", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("481,80");
});
