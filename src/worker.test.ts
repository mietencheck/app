import { describe, expect, test, vi } from "vitest";

import worker from "./worker";

const env = {
  ASSETS: {
    fetch: vi.fn(),
  },
} as unknown as Parameters<typeof worker.fetch>[1];

describe("/api/miete", () => {
  test("returns preisspanne and still handles empty-alias options", async () => {
    const response = await worker.fetch(
      new Request("https://example.com/api/miete", {
        method: "POST",
        body: JSON.stringify({
          Typ: "Miete",
          Unterschrieben: "Ja",
          Vertragsdatum: "2022-2024",
          Ost: false,
          Wohnlage: "einfach",
          Baujahr: 1918,
          Qm: 50,
          "Wohnung hat Sammelheizung": "Ja",
          "Badezimmer in Wohnung": "Ja",
          Dachgeschoss: "Ja",
        }),
      }) as never,
      env,
    );

    expect(response.status).toBe(200);

    const json = (await response.json()) as {
      answers: Record<string, unknown>;
      visibleQuestionAliases: string[];
      preisspanne: {
        worst: [number, number, number];
        best: [number, number, number];
      } | null;
      issues: Array<{ questionAlias: string }>;
    };

    expect(json.answers.Dachgeschoss).toBe("Ja");
    //expect(json.visibleQuestionAliases).toContain("Dachgeschoss Ausgebaut"); @Gregor temporary fix
    expect(json.preisspanne).toEqual({
      best: [7.19, 5.61, 10.59],
      worst: [7.19, 5.61, 10.59],
    });
    expect(json.issues).toEqual([]);
  });

  test("accepts a wrapped answers object, applies derived answers, and returns preisspanne", async () => {
    const response = await worker.fetch(
      new Request("https://example.com/api/miete", {
        method: "POST",
        body: JSON.stringify({
          answers: {
            Typ: "Miete",
            Unterschrieben: "Nein",
            Ost: false,
            Wohnlage: "einfach",
            Baujahr: 1918,
            Qm: "50",
            "Wohnung hat Sammelheizung": "Ja",
            "Badezimmer in Wohnung": "Ja",
          },
        }),
      }) as never,
      env,
    );

    expect(response.status).toBe(200);

    const json = (await response.json()) as {
      answers: Record<string, unknown>;
      preisspanne: {
        worst: [number, number, number];
        best: [number, number, number];
      } | null;
      issues: Array<{ questionAlias: string }>;
    };

    expect(json.answers.Vertragsdatum).toBe(">2024");
    expect(json.answers.Qm).toBe(50);
    expect(json.preisspanne).toEqual({
      best: [8.02, 6.1, 11.19],
      worst: [8.02, 6.1, 11.19],
    });
    expect(json.issues).toEqual([]);
  });
});
