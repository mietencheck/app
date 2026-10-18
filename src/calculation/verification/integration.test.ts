import { expect, test } from "vitest";

import { answersToCalculationContext } from "~/form/calculation-context";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import worker from "~/worker";

import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { getWorstBestPreisspanne } from "../preisspanne";
import { CalculationContext } from "../types";
import { getWorstBestZulaessigeHoechstmiete } from "../zulaessigeHoechstmiete";
import { mietspiegelReferences } from "./fixtures";
import examples from "./reference/mietspiegel-examples.json";

const vertragsdatumSpannen = [
  "2015-2016",
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
  "2024-2026",
  ">2026",
] as const;

const env = {} as Parameters<typeof worker.fetch>[1];

test.each(examples)(
  "published $id through real questionnaire mapping and HTTP endpoints",
  async (example) => {
    const mietspiegelIndex = mietspiegelReferences.findIndex(
      (mietspiegel) => mietspiegel.mietspiegeljahr === example.mietspiegeljahr,
    );
    const row = mietspiegelReferences[mietspiegelIndex].rows.find(
      (row) => row.tabellenfeld === example.tabellenfeld,
    )!;
    const answers = {
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      Typ: "Miete",
      Unterschrieben: "Ja",
      Vertragsdatum: vertragsdatumSpannen[mietspiegelIndex],
      Baujahr: Number(row.baujahrSpanne.split("-").at(-1)),
      Wohnlage: row.wohnlage,
      Ost: false,
      Qm: Number(example.wohnflaeche),
      "Wohnung hat Sammelheizung": "Ja",
      "Badezimmer in Wohnung": "Ja",
      "Wohnung hat Balkon": "Ja",
      ...(example.merkmalsgruppen[0] > 0
        ? { "Bad mit Fußbodenheizung": "Ja" }
        : {}),
      ...(example.merkmalsgruppen[1] > 0
        ? { "Küche hat Einbauküche": "Ja" }
        : {}),
      ...(example.merkmalsgruppen[2] > 0
        ? { "Wohnung hat Abstellraum": "Ja" }
        : {}),
      ...(example.merkmalsgruppen[3] > 0
        ? { "Gebäude hat Treppenhaus in gutem Zustand": "Ja" }
        : {}),
      ...(example.merkmalsgruppen[3] < 0
        ? { "Gebäude ist in schlechtem Zustand": "Ja" }
        : {}),
      ...(example.merkmalsgruppen[4] < 0
        ? {
            "Wohnumfeld ist besonders laut": "Ja",
            "Wohnumfeld ist geräuschs- oder geruchsbelastet": "Ja",
          }
        : {}),
      ...(example.sondermerkmale.includes(
        "[Sondermerkmal] Moderne Küchenausstattung",
      )
        ? { "Sondermerkmal Moderne Küche": "Ja" }
        : {}),
      ...(example.sondermerkmale.includes("[Sondermerkmal] Modernes Bad")
        ? { "Sondermerkmal Modernes Bad": "Ja" }
        : {}),
      ...(example.sondermerkmale.includes(
        "[Sondermerkmal] Hochwertiger Bodenbelag",
      )
        ? { "Sondermerkmal Bodenbelag": "Ja" }
        : {}),
    } as FinalAnswers;
    const visible = getVisibleQuestionAliases(answers);
    const ctx = answersToCalculationContext(answers, visible)!;
    expect(ctx?.mietspiegeljahr).toBe(example.mietspiegeljahr);
    expect(ctx?.baujahrSpanne).toBe(row.baujahrSpanne);
    expect(getWorstBestPreisspanne(ctx)).toEqual({
      best: [
        row.mittelwertInCent! / 100,
        row.unterwertInCent! / 100,
        row.oberwertInCent! / 100,
      ],
      worst: [
        row.mittelwertInCent! / 100,
        row.unterwertInCent! / 100,
        row.oberwertInCent! / 100,
      ],
    });
    expect(getWorstBestOrtsueblicheVergleichsmiete(ctx)).toEqual({
      best: example.expectedVergleichsmietePerQmInCent / 100,
      worst: example.expectedVergleichsmietePerQmInCent / 100,
    });
    const expected = {
      best: example.expectedMonthlyHoechstmieteInCent / 100,
      worst: example.expectedMonthlyHoechstmieteInCent / 100,
    };
    expect(getWorstBestZulaessigeHoechstmiete(ctx)).toEqual(expected);
    const response = await worker.fetch(
      new Request("https://example.com/zulaessige-hoechstmiete", {
        method: "POST",
        body: JSON.stringify({ answers, visibleQuestionAliases: [...visible] }),
      }) as never,
      env,
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expected);
    const flowResponse = await worker.fetch(
      new Request("https://example.com/api/miete", {
        method: "POST",
        body: JSON.stringify({ answers }),
      }) as never,
      env,
    );
    expect(flowResponse.status).toBe(200);
    const flowResult = (await flowResponse.json()) as { preisspanne: unknown };
    expect(flowResult.preisspanne).toEqual(getWorstBestPreisspanne(ctx));
  },
);

test.each([0, -1, NaN, Infinity, -Infinity])(
  "invalid Wohnfläche %s cannot produce a rent",
  (wohnflaeche) => {
    const answers = {
      Typ: "Miete",
      Unterschrieben: "Nein",
      Baujahr: 1900,
      Wohnlage: "einfach",
      Qm: wohnflaeche,
    } as FinalAnswers;
    expect(
      answersToCalculationContext(answers, new Set(Object.keys(answers))),
    ).toBeUndefined();
  },
);

test.each([
  "unknown Mietspiegeljahr",
  "unknown Baujahrspanne",
  "unknown Wohnlage",
  "unknown Wohnflächenspanne",
])("%s cannot throw or fabricate a rent", (invalid) => {
  const ctx = {
    typ: "Miete",
    mietspiegeljahr: "2026",
    baujahrSpanne: "-1918",
    wohnlage: "einfach",
    wohnflaeche: 50,
    wohnflaecheSpanne: "50-55",
    ausstattung: { sammelheizung: "Ja", bad: "Ja" },
    merkmale: {},
    ...(invalid === "unknown Mietspiegeljahr"
      ? { mietspiegeljahr: "2099" }
      : {}),
    ...(invalid === "unknown Baujahrspanne"
      ? { baujahrSpanne: "2090-2099" }
      : {}),
    ...(invalid === "unknown Wohnlage" ? { wohnlage: "unknown" } : {}),
    ...(invalid === "unknown Wohnflächenspanne"
      ? { wohnflaecheSpanne: "999-" }
      : {}),
  } as CalculationContext;
  expect(getWorstBestZulaessigeHoechstmiete(ctx)).toBeUndefined();
});
