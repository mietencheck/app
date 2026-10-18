import { describe, expect, test } from "vitest";

import { getBaujahrSpanne, getWohnflaecheSpanne } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { preisspannenByMietspiegeljahr } from "~/mietspiegel/preisspannen";
import { Mietspiegeljahr, Sondermerkmal } from "~/mietspiegel/types";

import { getWorstBestAusstattungsAbzug } from "../ausstattungsAbzug";
import { getWorstBestPreisspanne } from "../preisspanne";
import { getWorstBestSondermerkmalModifier } from "../sondermerkmale";
import {
  contextFor,
  mietspiegelReferences,
  wohnflaechenSpannenKey,
} from "./fixtures";
import rules from "./reference/rules.json";

for (const mietspiegel of mietspiegelReferences) {
  describe(`PDF ${mietspiegel.mietspiegeljahr}: complete table`, () => {
    test("contains exactly the published populated fields", () => {
      const actual = preisspannenByMietspiegeljahr[
        mietspiegel.mietspiegeljahr as Mietspiegeljahr
      ] as Record<string, Record<string, Record<string, unknown>>>;
      const keys = Object.entries(actual).flatMap(
        ([baujahrSpanne, wohnlagen]) =>
          Object.entries(wohnlagen).flatMap(([wohnlage, wohnflaechenSpannen]) =>
            Object.entries(wohnflaechenSpannen)
              .filter(([, values]) => Boolean(values))
              .map(
                ([wohnflaeche]) =>
                  `${baujahrSpanne}/${wohnlage}/${wohnflaeche}`,
              ),
          ),
      );
      expect(keys.sort()).toEqual(
        mietspiegel.rows
          .filter((row) => row.mittelwertInCent !== null)
          .map(
            (row) =>
              `${row.baujahrSpanne}/${row.wohnlage}/${wohnflaechenSpannenKey(row)}`,
          )
          .sort(),
      );
    });

    test.each(mietspiegel.rows)(
      "Tabellenfeld $tabellenfeld, PDF page $pdfPage",
      (row) => {
        const actual = getWorstBestPreisspanne(
          contextFor(mietspiegel.mietspiegeljahr, row),
        );
        if (row.mittelwertInCent === null) {
          expect(actual).toBeUndefined();
        } else {
          const expected = [
            row.mittelwertInCent,
            row.unterwertInCent!,
            row.oberwertInCent!,
          ].map((value) => value / 100);
          expect(actual).toEqual({ best: expected, worst: expected });
        }
      },
    );

    test.each(mietspiegel.rows)(
      "Tabellenfeld $tabellenfeld: Wohnfläche and Baujahrspanne boundaries",
      (row) => {
        const [start, end] = row.baujahrSpanne
          .replace(/^[WO]:/, "")
          .split("-")
          .map(Number);
        const baujahr = end;
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
          )[mietspiegel.mietspiegeljahr as Mietspiegeljahr],
          Baujahr: baujahr,
          Ost: row.baujahrSpanne.startsWith("O:"),
          Wohnlage: row.wohnlage,
        } as FinalAnswers;
        const visible = new Set(["Baujahr", "Ost", "Wohnlage", "Qm"]);
        for (const baujahr of [start || 1800, end]) {
          expect(getBaujahrSpanne({ ...base, Baujahr: baujahr }, visible)).toBe(
            row.baujahrSpanne,
          );
        }
        const siblings = mietspiegel.rows.filter(
          (candidate) =>
            candidate.baujahrSpanne === row.baujahrSpanne &&
            candidate.wohnlage === row.wohnlage,
        );
        const boundaries = [
          Math.max(row.minWohnflaeche, 0.01),
          row.minWohnflaeche + 0.01,
        ];
        if (row.minWohnflaeche > 0) boundaries.push(row.minWohnflaeche - 0.01);
        if (row.maxWohnflaecheExclusive !== null)
          boundaries.push(
            row.maxWohnflaecheExclusive - 0.01,
            row.maxWohnflaecheExclusive,
            row.maxWohnflaecheExclusive + 0.01,
          );
        for (const wohnflaeche of boundaries) {
          const sourceRow = siblings.find(
            (candidate) =>
              wohnflaeche >= candidate.minWohnflaeche &&
              (candidate.maxWohnflaecheExclusive === null ||
                wohnflaeche < candidate.maxWohnflaecheExclusive),
          );
          const expected =
            sourceRow?.mittelwertInCent == null
              ? undefined
              : wohnflaechenSpannenKey(sourceRow);
          expect(
            getWohnflaecheSpanne({ ...base, Qm: wohnflaeche }, visible),
            `wohnflaeche ${wohnflaeche}`,
          ).toBe(expected);
        }
      },
    );
  });
}

describe("source footnotes: Ausstattungsabzüge", () => {
  test.each(rules.ausstattungsAbzuege)(
    "$mietspiegeljahr $baujahrSpanne (PDF p. $pdfPage)",
    (rule) => {
      const row = mietspiegelReferences
        .find((data) => data.mietspiegeljahr === rule.mietspiegeljahr)!
        .rows.find(
          (candidate) =>
            candidate.baujahrSpanne === rule.baujahrSpanne &&
            candidate.mittelwertInCent !== null,
        )!;
      for (const [sammelheizung, bad, ausstattungsAbzug] of [
        ["Ja", "Ja", 0],
        ["Nein", "Ja", rule.ausstattungsAbzugForOneMissingMerkmalInCent],
        ["Ja", "Nein", rule.ausstattungsAbzugForOneMissingMerkmalInCent],
        ...(rule.ausstattungsAbzugWithoutSammelheizungAndBadInCent === null
          ? []
          : [
              [
                "Nein",
                "Nein",
                rule.ausstattungsAbzugWithoutSammelheizungAndBadInCent,
              ],
            ]),
      ] as const) {
        const ctx = contextFor(rule.mietspiegeljahr, row);
        ctx.ausstattung = {
          sammelheizung: sammelheizung as "Ja" | "Nein",
          bad: bad as "Ja" | "Nein",
        };
        expect(getWorstBestAusstattungsAbzug(ctx)).toEqual({
          best: Number(ausstattungsAbzug) / 100,
          worst: Number(ausstattungsAbzug) / 100,
        });
      }
    },
  );
});

describe("2015 section 10.1: every Sondermerkmal cell", () => {
  for (const [name, amounts] of Object.entries(
    rules.sondermerkmale2015.zuAbschlaegeInCent,
  )) {
    test.each(
      rules.sondermerkmale2015.baujahrSpannen.map((baujahrSpanne, index) => ({
        baujahrSpanne,
        amount: amounts[index],
      })),
    )(`${name}: $baujahrSpanne`, ({ baujahrSpanne, amount }) => {
      const row = mietspiegelReferences[0].rows.find(
        (candidate) => candidate.baujahrSpanne === baujahrSpanne,
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
