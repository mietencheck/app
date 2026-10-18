import { expect, test } from "vitest";

import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { getWorstBestZulaessigeHoechstmiete } from "../zulaessigeHoechstmiete";
import { contextFor, mietspiegelReferences } from "./fixtures";
import {
  referenceMonthlyHoechstmieteInCent,
  referenceVergleichsmietePerQmInCent,
} from "./reference-calculation";
import examples from "./reference/mietspiegel-examples.json";
import rules from "./reference/rules.json";

test.each(examples)(
  "published $id, PDF p. $pdfPage section $section",
  (example) => {
    const row = mietspiegelReferences
      .find(
        (mietspiegel) =>
          mietspiegel.mietspiegeljahr === example.mietspiegeljahr,
      )!
      .rows.find((row) => row.tabellenfeld === example.tabellenfeld)!;
    const ctx = contextFor(
      example.mietspiegeljahr,
      row,
      example.merkmalsgruppen,
      example.sondermerkmale,
    );
    ctx.wohnflaeche = Number(example.wohnflaeche);
    const sondermerkmalZuAbschlagInCent = example.sondermerkmale.reduce(
      (sum, name) =>
        sum +
        rules.sondermerkmale2015.zuAbschlaegeInCent[
          name as keyof typeof rules.sondermerkmale2015.zuAbschlaegeInCent
        ][rules.sondermerkmale2015.baujahrSpannen.indexOf(row.baujahrSpanne)],
      0,
    );
    expect(
      referenceVergleichsmietePerQmInCent(
        row,
        example.merkmalsgruppen,
        0,
        sondermerkmalZuAbschlagInCent,
      ),
    ).toBe(example.expectedVergleichsmietePerQmInCent);
    expect(getWorstBestOrtsueblicheVergleichsmiete(ctx)).toEqual({
      best: example.expectedVergleichsmietePerQmInCent / 100,
      worst: example.expectedVergleichsmietePerQmInCent / 100,
    });
    // Monthly amounts are our independently derived standard scenario, not a PDF claim about legal eligibility.
    expect(
      referenceMonthlyHoechstmieteInCent(
        example.expectedVergleichsmietePerQmInCent,
        example.wohnflaeche,
        true,
      ),
    ).toBe(example.expectedMonthlyHoechstmieteInCent);
    expect(getWorstBestZulaessigeHoechstmiete(ctx)).toEqual({
      best: example.expectedMonthlyHoechstmieteInCent / 100,
      worst: example.expectedMonthlyHoechstmieteInCent / 100,
    });
  },
);
