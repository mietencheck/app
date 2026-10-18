import { expect, test } from "vitest";

import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import worker from "~/worker";

import { answersToCalculationContext } from "./calculation-context";
import {
  evaluateFlowMachine,
  getVisibleQuestionAliases,
} from "./flow-machine-evaluation";
import { FinalAnswers } from "./flow-machine-runtime";

const address = (hasMittlereWohnlageIn2026 = true) =>
  JSON.stringify({
    plz: "10115",
    strasse: "Teststraße",
    nummer: "1",
    lage: {
      "2024": { wohnlage: "einfach", ost: false },
      "2026": {
        wohnlage: hasMittlereWohnlageIn2026 ? "mittel" : "einfach",
        ost: false,
      },
    },
  });

const input = {
  Typ: "Miete",
  Unterschrieben: "Ja",
  Mietart: "Normal",
  Vertragsdatum: ">2026",
  Adresse: address(),
  "Baujahr vor 1991": "1919-1949",
  Qm: 60,
  "Wohnung hat Sammelheizung": "Ja",
  "Badezimmer in Wohnung": "Ja",
  Ausnahmen: "Keine",
};

function calculate(answers: Record<string, unknown>) {
  const evaluation = evaluateFlowMachine(answers);
  const ctx = answersToCalculationContext(
    evaluation.answers as FinalAnswers,
    new Set(evaluation.visibleQuestionAliases),
  );
  return {
    evaluation,
    ctx,
    table: ctx ? getWorstBestPreisspanne(ctx) : undefined,
  };
}

test("address and Baujahrspanne inputs alone derive the full applicable flow", () => {
  const { evaluation, ctx, table } = calculate(input);
  expect(evaluation.answers).toMatchObject({
    Wohnlage: "mittel",
    Baujahr: 1919,
    Ost: false,
  });
  expect(evaluation.visibleQuestionAliases).toEqual([
    ...getVisibleQuestionAliases(evaluation.answers as FinalAnswers),
  ]);
  expect(evaluation.visibleQuestionAliases).toEqual(
    expect.arrayContaining(["Qm", "Baujahr", "Bad mindestens 4qm"]),
  );
  expect(ctx).toBeDefined();
  expect(table).toEqual({ best: [7.3, 5.9, 9.55], worst: [7.3, 5.9, 9.55] }); // 2026 row 81
  const explicit = calculate({
    ...input,
    Wohnlage: "mittel",
    Baujahr: 1919,
    Ost: false,
  });
  expect(explicit.table).toEqual(table);
  expect(explicit.evaluation.visibleQuestionAliases).toEqual(
    evaluation.visibleQuestionAliases,
  );
});

test("changing an address overrides stale Wohnlage/Ost fields before determining visibility", () => {
  const { evaluation, table } = calculate({
    ...input,
    Adresse: address(false),
    Wohnlage: "gut",
    Ost: true,
  });
  expect(evaluation.answers).toMatchObject({ Wohnlage: "einfach", Ost: false });
  expect(table).toEqual({
    best: [6.99, 5.78, 9.12],
    worst: [6.99, 5.78, 9.12],
  }); // 2026 row 16
  expect(evaluation.visibleQuestionAliases).toEqual([
    ...getVisibleQuestionAliases(evaluation.answers as FinalAnswers),
  ]);
});

test("changing the Mietspiegeljahr changes the Wohnlage and corresponding question branches", () => {
  const { evaluation, table } = calculate({
    ...input,
    Vertragsdatum: "2024-2026",
    Wohnlage: "mittel",
  });
  expect(evaluation.answers.Wohnlage).toBe("einfach");
  expect(table).toEqual({
    best: [6.54, 5.55, 8.82],
    worst: [6.54, 5.55, 8.82],
  }); // 2024 row 11
  expect(evaluation.visibleQuestionAliases).toEqual([
    ...getVisibleQuestionAliases(evaluation.answers as FinalAnswers),
  ]);
});

test("changing the Baujahrspanne overrides an old concrete Baujahr", () => {
  const { evaluation, ctx } = calculate({
    ...input,
    Baujahr: 1900,
    "Baujahr vor 1991": "1950-1964",
  });
  expect(evaluation.answers.Baujahr).toBe(1950);
  expect(ctx?.baujahrSpanne).toBe("1950-1964");
  expect(evaluation.visibleQuestionAliases).toEqual([
    ...getVisibleQuestionAliases(evaluation.answers as FinalAnswers),
  ]);
});

test("an address without data for the selected Mietspiegeljahr cannot retain stale Wohnlage/Ost fields", () => {
  const { evaluation, ctx, table } = calculate({
    ...input,
    Wohnlage: "mittel",
    Ost: false,
    Adresse: JSON.stringify({
      plz: "10115",
      strasse: "Teststraße",
      nummer: "1",
      lage: { "2024": { wohnlage: "einfach", ost: false } },
    }),
  });
  expect(evaluation.answers).toMatchObject({ Wohnlage: null, Ost: null });
  expect(ctx).toBeUndefined();
  expect(table).toBeUndefined();
});

test("the HTTP API calculates from an address without separately submitted derived fields", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/miete", {
      method: "POST",
      body: JSON.stringify(input),
    }) as never,
    {} as Parameters<typeof worker.fetch>[1],
  );
  expect(response.status).toBe(200);
  const result = (await response.json()) as {
    preisspanne: unknown;
    visibleQuestionAliases: string[];
    issues: unknown[];
  };
  expect(result.preisspanne).toEqual({
    best: [7.3, 5.9, 9.55],
    worst: [7.3, 5.9, 9.55],
  });
  expect(result.visibleQuestionAliases).toContain("Qm");
  expect(result.issues).toEqual([]);
});
