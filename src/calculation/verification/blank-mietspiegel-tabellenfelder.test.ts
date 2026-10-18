import { ungroup } from "flow-machine";
import { expect, test } from "vitest";

import { flowMachine } from "~/form/flow-machine";
import { vertragsdatumToMietspiegelJahrMapping } from "~/form/mappings/vertragsdatum";

import { mietspiegelReferences } from "./mietspiegel-fixtures";
import { ReferenceRow } from "./reference-miete-calculation";

const vertragsdatumByMietspiegeljahr = Object.fromEntries(
  Object.entries(vertragsdatumToMietspiegelJahrMapping)
    .filter(([vertragsdatum]) => vertragsdatum !== ">2026")
    .map(([vertragsdatum, mietspiegeljahr]) => [
      mietspiegeljahr,
      vertragsdatum,
    ]),
);

// Flats built after 2014 exit earlier as Neubauwohnung (§ 556f BGB).
const LAST_BAUJAHR_BEFORE_NEUBAU_EXIT = 2014;

function parseBaujahrSpanne(baujahrSpanne: string) {
  const [, region, range] = /^(?:([WO]):)?(.*)$/.exec(baujahrSpanne)!;
  const [from, to] = range.split("-").map(Number);
  return {
    baujahre: [from, Math.min(to, LAST_BAUJAHR_BEFORE_NEUBAU_EXIT)],
    ostValues:
      region === "W" ? [false] : region === "O" ? [true] : [false, true],
  };
}

// Every cell the source PDF leaves blank (too few data points) must end the
// questionnaire instead of producing a zulässige Höchstmiete from a neighbouring cell.
const cases = mietspiegelReferences.flatMap((mietspiegel) =>
  (mietspiegel.rows as ReferenceRow[])
    .filter((row) => row.mittelwertInCent === null)
    .flatMap((row) => {
      const { baujahre, ostValues } = parseBaujahrSpanne(row.baujahrSpanne);
      const qms = [
        Math.max(row.minWohnflaeche, 20),
        row.maxWohnflaecheExclusive === null
          ? row.minWohnflaeche + 50
          : row.maxWohnflaecheExclusive - 1,
      ];
      return baujahre.flatMap((Baujahr) =>
        ostValues.flatMap((Ost) =>
          qms.map((Qm) => ({
            label: `${mietspiegel.mietspiegeljahr} ${row.tabellenfeld} ${row.baujahrSpanne} ${row.wohnlage} Baujahr=${Baujahr} Ost=${Ost} Qm=${Qm}`,
            answers: {
              Typ: "Miete",
              Unterschrieben: "Ja",
              Mietart: "Normal",
              Vertragsdatum:
                vertragsdatumByMietspiegeljahr[mietspiegel.mietspiegeljahr],
              Baujahr,
              Ost,
              Wohnlage: row.wohnlage,
              Qm,
            },
          })),
        ),
      );
    }),
);

test("the reference data contains the 34 blank cells of the source PDFs", () => {
  expect(
    mietspiegelReferences.flatMap((mietspiegel) =>
      (mietspiegel.rows as ReferenceRow[]).filter(
        (row) => row.mittelwertInCent === null,
      ),
    ),
  ).toHaveLength(34);
});

// Known flow gap: for Mietspiegel 2017 the flow checks blank cell C8
// (2003-2015, gut, < 40 m²) only up to Baujahr 2013, so Baujahr 2014 falls
// through to a result page without a Preisspanne. Fix in the floma.io editor
// (Vertragsdatum 2016-2018 branch: Baujahr lte 2013 → lte 2015); this test then
// fails and the case can move into the regular list.
const isKnownGap = (label: string) =>
  label.startsWith("2017 C8 ") && label.includes("Baujahr=2014 ");

function expectFeldLeerExit(answers: Record<string, unknown>) {
  const steps = ungroup(
    flowMachine.run(flowMachine.answers(answers as never).state),
  );
  expect(steps.at(-1)).toMatchObject({
    type: "Exit",
    alias: "Exit: Mietspiegel Feld Leer",
  });
}

test.each(cases.filter(({ label }) => !isKnownGap(label)))(
  "$label exits with Mietspiegel Feld Leer",
  ({ answers }) => expectFeldLeerExit(answers),
);

test.fails.each(cases.filter(({ label }) => isKnownGap(label)))(
  "known gap: $label does not exit yet",
  ({ answers }) => expectFeldLeerExit(answers),
);
