import { createRequire } from "node:module";

import { expect, test } from "@playwright/test";
import { FlowMachine } from "flow-machine";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../src/form/mappings/answer-reset";

const require = createRequire(import.meta.url);
const flowMachine = new FlowMachine(require("../src/form/flow.fm.json"));

function savedAnswers(overrides: Record<string, unknown> = {}) {
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
      lage: Object.fromEntries(
        ["2015", "2017", "2019", "2021", "2023", "2024", "2026"].map((year) => [
          year,
          { wohnlage: "mittel", ost: false },
        ]),
      ),
    }),
    ...overrides,
  } as never).state;
}

const editions = [
  { year: "2015", date: "2015-2016", firstPage: "sondermerkmale" },
  { year: "2017", date: "2016-2018", firstPage: "bad-u-wc" },
  { year: "2019", date: "2018-2020", firstPage: "bad-u-wc" },
  { year: "2021", date: "2020-2022", firstPage: "bad-u-wc" },
  { year: "2023", date: "2022-2024", firstPage: "bad-u-wc" },
  { year: "2024", date: "2024-2026", firstPage: "bad-u-wc" },
  { year: "2026", date: ">2026", firstPage: "bad-u-wc" },
];

for (const locale of ["de", "en"] as const) {
  for (const edition of editions) {
    test(`${locale}, ${edition.year}: notice only on first Ausstattung page`, async ({
      page,
    }, testInfo) => {
      await page.addInitScript(
        ({ answers, locale }) => {
          if (!localStorage.getItem("mb-flow"))
            localStorage.setItem("mb-flow", JSON.stringify(answers));
          localStorage.setItem("locale", JSON.stringify(locale));
        },
        { answers: savedAnswers({ Vertragsdatum: edition.date }), locale },
      );
      const instruction = page.getByRole("complementary").filter({
        has: page.getByRole("heading", {
          name:
            locale === "de"
              ? "Welche Ausstattung zählt?"
              : "Which fittings count?",
        }),
      });
      await page.goto(`/fragebogen/${edition.firstPage}`);
      await expect(instruction).toBeVisible();
      await expect(instruction).toContainText(
        locale === "de" ? "dein eigener Kühlschrank" : "your own refrigerator",
      );
      await expect(instruction).toContainText(
        locale === "de" ? "nur teilweise erstattet" : "only partly reimbursed",
      );
      await expect(instruction).not.toContainText("Vermieterin");
      await page.screenshot({ path: testInfo.outputPath("ausstattung.png") });
      if (edition.firstPage === "sondermerkmale") {
        await page.goto("/fragebogen/bad-u-wc");
        await expect(instruction).toHaveCount(0);
      }
      for (const route of [
        "küche",
        "wohnung",
        "gebäude",
        "wärmedämmung",
        "wohnumfeld",
      ]) {
        await page.goto(`/fragebogen/${route}`);
        await expect(instruction).toHaveCount(0);
      }
      for (const id of ["icpny", "hzqza"]) {
        await page.goto(`/schnelltest#${id}`);
        await expect(instruction).toHaveCount(0);
        await expect(
          page.getByText(
            /Beurteile den Zustand ohne selbst bezahlte|Assess the condition without fittings/,
          ),
        ).toHaveCount(0);
      }
    });
  }
}

test("2015: notice falls back to Bad & WC when Sondermerkmale do not apply", async ({
  page,
}) => {
  await page.addInitScript(
    (answers) => {
      localStorage.setItem("mb-flow", JSON.stringify(answers));
      localStorage.setItem("locale", JSON.stringify("de"));
    },
    savedAnswers({
      Vertragsdatum: "2015-2016",
      Baujahr: 2003,
      "Baujahr vor 1991": "1991-",
      "Baujahr ab 1991": 2003,
    }),
  );
  await page.goto("/fragebogen/bad-u-wc");
  await expect(
    page.getByRole("heading", { name: "Welche Ausstattung zählt?" }),
  ).toBeVisible();
});

// Identical physical refrigerator, but different funding facts. The user
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
  test(`same refrigerator, ${scenario.funding}: answer affects rent and survives reload`, async ({
    page,
  }) => {
    await page.addInitScript((answers) => {
      if (!localStorage.getItem("mb-flow"))
        localStorage.setItem("mb-flow", JSON.stringify(answers));
      localStorage.setItem("locale", JSON.stringify("de"));
    }, savedAnswers());
    await page.goto("/fragebogen/küche");
    const question = page.getByRole("radiogroup", {
      name: "Ist die Küche mit mindestens einem der folgenden Geräte ausgestattet: Kühlschrank, Tiefkühlschrank, Geschirrspüler.",
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
