import { describe, expect, test } from "vitest";

import { getBaujahrSpanne, getWohnflaecheSpanne } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { preisspannenByMietspiegeljahr } from "~/mietspiegel/preisspannen";
import { Mietspiegeljahr, Sondermerkmal } from "~/mietspiegel/types";

import { getWorstBestAusstattungsAbzug } from "../ausstattungsAbzug";
import { getWorstBestPreisspanne } from "../preisspanne";
import { getWorstBestSondermerkmalModifier } from "../sondermerkmale";
import { areaKey, contextFor, editions } from "./fixtures";
import rules from "./reference/rules.json";

for (const edition of editions) {
  describe(`PDF ${edition.edition}: complete table`, () => {
    test("contains exactly the published populated fields", () => {
      const actual = preisspannenByMietspiegeljahr[
        edition.edition as Mietspiegeljahr
      ] as Record<string, Record<string, Record<string, unknown>>>;
      const keys = Object.entries(actual).flatMap(([period, locations]) =>
        Object.entries(locations).flatMap(([location, areas]) =>
          Object.entries(areas)
            .filter(([, values]) => Boolean(values))
            .map(([area]) => `${period}/${location}/${area}`),
        ),
      );
      expect(keys.sort()).toEqual(
        edition.rows
          .filter((row) => row.medianCents !== null)
          .map((row) => `${row.period}/${row.location}/${areaKey(row)}`)
          .sort(),
      );
    });

    test.each(edition.rows)("field $field, PDF page $pdfPage", (row) => {
      const actual = getWorstBestPreisspanne(contextFor(edition.edition, row));
      if (row.medianCents === null) {
        expect(actual).toBeUndefined();
      } else {
        const expected = [
          row.medianCents,
          row.lowerCents!,
          row.upperCents!,
        ].map((value) => value / 100);
        expect(actual).toEqual({ best: expected, worst: expected });
      }
    });

    test.each(edition.rows)(
      "field $field: area and construction boundaries",
      (row) => {
        const [start, end] = row.period
          .replace(/^[WO]:/, "")
          .split("-")
          .map(Number);
        const year = end;
        const base = {
          Unterschrieben: "Ja",
          Vertragsdatum: (
            {
              "2015": "2015-2016",
              "2017": "2016-2018",
              "2019": "2018-2020",
              "2021": "2020-2022",
              "2023": "2022-2024",
              "2024": "2024-2026",
              "2026": ">2026",
            } as const
          )[edition.edition as Mietspiegeljahr],
          Baujahr: year,
          Ost: row.period.startsWith("O:"),
          Wohnlage: row.location,
        } as FinalAnswers;
        const visible = new Set(["Baujahr", "Ost", "Wohnlage", "Qm"]);
        for (const baujahr of [start || 1800, end]) {
          expect(getBaujahrSpanne({ ...base, Baujahr: baujahr }, visible)).toBe(
            row.period,
          );
        }
        const siblings = edition.rows.filter(
          (candidate) =>
            candidate.period === row.period &&
            candidate.location === row.location,
        );
        const boundaries = [Math.max(row.minArea, 0.01), row.minArea + 0.01];
        if (row.minArea > 0) boundaries.push(row.minArea - 0.01);
        if (row.maxArea !== null)
          boundaries.push(row.maxArea - 0.01, row.maxArea, row.maxArea + 0.01);
        for (const area of boundaries) {
          const sourceRow = siblings.find(
            (candidate) =>
              area >= candidate.minArea &&
              (candidate.maxArea === null || area < candidate.maxArea),
          );
          const expected =
            sourceRow?.medianCents == null ? undefined : areaKey(sourceRow);
          expect(
            getWohnflaecheSpanne({ ...base, Qm: area }, visible),
            `area ${area}`,
          ).toBe(expected);
        }
      },
    );
  });
}

describe("source footnotes: low-standard deductions", () => {
  test.each(rules.deductions)("$edition $period (PDF p. $pdfPage)", (rule) => {
    const row = editions
      .find((data) => data.edition === rule.edition)!
      .rows.find(
        (candidate) =>
          candidate.period === rule.period && candidate.medianCents !== null,
      )!;
    for (const [heating, bathroom, deduction] of [
      ["Ja", "Ja", 0],
      ["Nein", "Ja", rule.oneMissingCents],
      ["Ja", "Nein", rule.oneMissingCents],
      ...(rule.bothMissingCents === null
        ? []
        : [["Nein", "Nein", rule.bothMissingCents]]),
    ] as const) {
      const ctx = contextFor(rule.edition, row);
      ctx.ausstattung = {
        sammelheizung: heating as "Ja" | "Nein",
        bad: bathroom as "Ja" | "Nein",
      };
      expect(getWorstBestAusstattungsAbzug(ctx)).toEqual({
        best: Number(deduction) / 100,
        worst: Number(deduction) / 100,
      });
    }
  });
});

describe("2015 section 10.1: every special-feature cell", () => {
  for (const [name, amounts] of Object.entries(
    rules.specialFeatures2015.amountsCents,
  )) {
    test.each(
      rules.specialFeatures2015.periods.map((period, index) => ({
        period,
        amount: amounts[index],
      })),
    )(`${name}: $period`, ({ period, amount }) => {
      const row = editions[0].rows.find(
        (candidate) => candidate.period === period,
      )!;
      const ctx = contextFor("2015", row, undefined, [name]);
      expect(getWorstBestSondermerkmalModifier(ctx)).toEqual({
        best: amount / 100,
        worst: amount / 100,
      });
      ctx.sondermerkmale![name as Sondermerkmal] = "maybe";
      expect(getWorstBestSondermerkmalModifier(ctx)).toEqual({
        best: Math.min(0, amount) / 100,
        worst: Math.max(0, amount) / 100,
      });
    });
  }
});
