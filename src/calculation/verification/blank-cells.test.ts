import { ungroup } from "flow-machine";
import { expect, test } from "vitest";

import { flowMachine } from "~/form/flow-machine";
import { vertragsdatumToMietspiegelJahrMapping } from "~/form/mappings/vertragsdatum";

import { editions } from "./fixtures";
import { ReferenceRow } from "./reference-calculation";

const vertragsdatumByEdition = Object.fromEntries(
  Object.entries(vertragsdatumToMietspiegelJahrMapping)
    .filter(([vertragsdatum]) => vertragsdatum !== ">2026")
    .map(([vertragsdatum, edition]) => [edition, vertragsdatum]),
);

// Flats built after 2014 exit earlier as Neubauwohnung (§ 556f BGB).
const LAST_BAUJAHR_BEFORE_NEUBAU_EXIT = 2014;

function parsePeriod(period: string) {
  const [, region, range] = /^(?:([WO]):)?(.*)$/.exec(period)!;
  const [from, to] = range.split("-").map(Number);
  return {
    baujahre: [from, Math.min(to, LAST_BAUJAHR_BEFORE_NEUBAU_EXIT)],
    ostValues:
      region === "W" ? [false] : region === "O" ? [true] : [false, true],
  };
}

// Every cell the source PDF leaves blank (too few data points) must end the
// questionnaire instead of producing a rent ceiling from a neighbouring cell.
const cases = editions.flatMap((edition) =>
  (edition.rows as ReferenceRow[])
    .filter((row) => row.medianCents === null)
    .flatMap((row) => {
      const { baujahre, ostValues } = parsePeriod(row.period);
      const qms = [
        Math.max(row.minArea, 20),
        row.maxArea === null ? row.minArea + 50 : row.maxArea - 1,
      ];
      return baujahre.flatMap((Baujahr) =>
        ostValues.flatMap((Ost) =>
          qms.map((Qm) => ({
            label: `${edition.edition} ${row.field} ${row.period} ${row.location} Baujahr=${Baujahr} Ost=${Ost} Qm=${Qm}`,
            answers: {
              Typ: "Miete",
              Unterschrieben: "Ja",
              Mietart: "Normal",
              Vertragsdatum: vertragsdatumByEdition[edition.edition],
              Baujahr,
              Ost,
              Wohnlage: row.location,
              Qm,
            },
          })),
        ),
      );
    }),
);

test("the reference data contains the 34 blank cells of the source PDFs", () => {
  expect(
    editions.flatMap((edition) =>
      (edition.rows as ReferenceRow[]).filter(
        (row) => row.medianCents === null,
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
