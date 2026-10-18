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
import { editions } from "./fixtures";
import examples from "./reference/published-examples.json";

const contracts = [
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
    const editionIndex = editions.findIndex(
      (edition) => edition.edition === example.edition,
    );
    const row = editions[editionIndex].rows.find(
      (row) => row.field === example.field,
    )!;
    const answers = {
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      Typ: "Miete",
      Unterschrieben: "Ja",
      Vertragsdatum: contracts[editionIndex],
      Baujahr: Number(row.period.split("-").at(-1)),
      Wohnlage: row.location,
      Ost: false,
      Qm: Number(example.area),
      "Wohnung hat Sammelheizung": "Ja",
      "Badezimmer in Wohnung": "Ja",
      "Wohnung hat Balkon": "Ja",
      ...(example.groups[0] > 0 ? { "Bad mit Fußbodenheizung": "Ja" } : {}),
      ...(example.groups[1] > 0 ? { "Küche hat Einbauküche": "Ja" } : {}),
      ...(example.groups[2] > 0 ? { "Wohnung hat Abstellraum": "Ja" } : {}),
      ...(example.groups[3] > 0
        ? { "Gebäude hat Treppenhaus in gutem Zustand": "Ja" }
        : {}),
      ...(example.groups[3] < 0
        ? { "Gebäude ist in schlechtem Zustand": "Ja" }
        : {}),
      ...(example.groups[4] < 0
        ? {
            "Wohnumfeld ist besonders laut": "Ja",
            "Wohnumfeld ist geräuschs- oder geruchsbelastet": "Ja",
          }
        : {}),
      ...(example.specialFeatures.includes(
        "[Sondermerkmal] Moderne Küchenausstattung",
      )
        ? { "Sondermerkmal Moderne Küche": "Ja" }
        : {}),
      ...(example.specialFeatures.includes("[Sondermerkmal] Modernes Bad")
        ? { "Sondermerkmal Modernes Bad": "Ja" }
        : {}),
      ...(example.specialFeatures.includes(
        "[Sondermerkmal] Hochwertiger Bodenbelag",
      )
        ? { "Sondermerkmal Bodenbelag": "Ja" }
        : {}),
    } as FinalAnswers;
    const visible = getVisibleQuestionAliases(answers);
    const ctx = answersToCalculationContext(answers, visible)!;
    expect(ctx?.mietspiegeljahr).toBe(example.edition);
    expect(ctx?.baujahrSpanne).toBe(row.period);
    expect(getWorstBestPreisspanne(ctx)).toEqual({
      best: [
        row.medianCents! / 100,
        row.lowerCents! / 100,
        row.upperCents! / 100,
      ],
      worst: [
        row.medianCents! / 100,
        row.lowerCents! / 100,
        row.upperCents! / 100,
      ],
    });
    expect(getWorstBestOrtsueblicheVergleichsmiete(ctx)).toEqual({
      best: example.expectedPerSqmCents / 100,
      worst: example.expectedPerSqmCents / 100,
    });
    const expected = {
      best: example.standardNewTenancyMonthlyCents / 100,
      worst: example.standardNewTenancyMonthlyCents / 100,
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
  "invalid area %s cannot produce a rent",
  (area) => {
    const answers = {
      Typ: "Miete",
      Unterschrieben: "Nein",
      Baujahr: 1900,
      Wohnlage: "einfach",
      Qm: area,
    } as FinalAnswers;
    expect(
      answersToCalculationContext(answers, new Set(Object.keys(answers))),
    ).toBeUndefined();
  },
);

test.each([
  "unknown edition",
  "unknown period",
  "unknown location",
  "unknown area band",
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
    ...(invalid === "unknown edition" ? { mietspiegeljahr: "2099" } : {}),
    ...(invalid === "unknown period" ? { baujahrSpanne: "2090-2099" } : {}),
    ...(invalid === "unknown location" ? { wohnlage: "unknown" } : {}),
    ...(invalid === "unknown area band" ? { wohnflaecheSpanne: "999-" } : {}),
  } as CalculationContext;
  expect(getWorstBestZulaessigeHoechstmiete(ctx)).toBeUndefined();
});
