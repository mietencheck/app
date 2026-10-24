import { createRequire } from "node:module";

import { expect, test } from "@playwright/test";
import { FlowMachine } from "flow-machine";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../src/form/mappings/answer-reset";

const require = createRequire(import.meta.url);
const flowMachine = new FlowMachine(require("../src/form/flow.fm.json"));

function savedAnswers() {
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
    Adresse: JSON.stringify({
      plz: "10115",
      strasse: "Teststraße",
      nummer: "1",
      lage: { "2026": { wohnlage: "mittel", ost: false } },
    }),
  } as never).state;
}

for (const locale of ["de", "en"] as const) {
  test(`${locale}: funding instruction is visible in both questionnaire stages`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      ({ answers, locale }) => {
        if (!localStorage.getItem("mb-flow"))
          localStorage.setItem("mb-flow", JSON.stringify(answers));
        localStorage.setItem("locale", JSON.stringify(locale));
      },
      { answers: savedAnswers(), locale },
    );

    const title =
      locale === "de" ? "Welche Ausstattung zählt?" : "Which fittings count?";
    const instruction = page
      .getByRole("complementary")
      .filter({ has: page.getByRole("heading", { name: title }) });
    // Hash selects the real, visible base-Ausstattung question in Schnelltest.
    await page.goto("/schnelltest#icpny");
    await expect(instruction).toBeVisible();
    await expect(instruction).toContainText(
      locale === "de" ? "nur teilweise erstattet" : "only partly reimbursed",
    );

    await page.goto("/fragebogen/bad-u-wc");
    await expect(instruction).toBeVisible();
    await expect(instruction).toContainText(
      locale === "de"
        ? "auch bei Fragen nach fehlender Ausstattung"
        : "including questions about missing fittings",
    );
    await page.screenshot({ path: testInfo.outputPath("ausstattung.png") });
    await page.goto("/fragebogen/küche");
    await expect(instruction).toBeVisible();
    await expect(
      page
        .getByText(
          locale === "de"
            ? /Berücksichtige nur Ausstattung/
            : /Count only fittings/,
        )
        .first(),
    ).toBeVisible();
  });
}

// Identical physical underfloor heating, but different funding facts. The user
// supplies the qualifying answer using the instruction; this is not automatic
// inference of funding from a physical-presence answer.
for (const scenario of [
  { funding: "landlord provided", answer: "Ja", amount: "511,50" },
  { funding: "tenant paid and reimbursed", answer: "Ja", amount: "511,50" },
  {
    funding: "tenant paid without reimbursement",
    answer: "Nein",
    amount: "481,80",
  },
  {
    funding: "reimbursement uncertain",
    answer: "Ich bin mir nicht sicher",
    amount: "481,80",
  },
]) {
  test(`same heating, ${scenario.funding}: answer affects rent and survives reload`, async ({
    page,
  }) => {
    await page.addInitScript((answers) => {
      if (!localStorage.getItem("mb-flow"))
        localStorage.setItem("mb-flow", JSON.stringify(answers));
      localStorage.setItem("locale", JSON.stringify("de"));
    }, savedAnswers());
    await page.goto("/fragebogen/bad-u-wc");
    await expect(
      page.getByRole("heading", { name: "Welche Ausstattung zählt?" }),
    ).toBeVisible();
    const question = page.getByRole("radiogroup", {
      name: "Gibt es ein Badezimmer mit Fußbodenheizung?",
      exact: true,
    });
    await question.getByText(scenario.answer, { exact: true }).click();
    await page.goto("/fragebogen/auswertung");
    for (let i = 0; i < 2; i++) {
      await page
        .getByRole("button", { name: "Auswertung ansehen", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toContainText(scenario.amount);
      if (scenario.answer === "Ich bin mir nicht sicher") {
        await expect(page.getByRole("dialog")).toContainText("511,50");
      }
      if (i === 0) await page.reload();
    }
  });
}
