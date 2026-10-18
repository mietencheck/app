import { expect, test } from "vitest";

import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { getWorstBestZulaessigeHoechstmiete } from "../zulaessigeHoechstmiete";
import { contextFor, editions } from "./fixtures";
import {
  referenceMonthlyCents,
  referencePerSqmCents,
} from "./reference-calculation";
import examples from "./reference/published-examples.json";
import rules from "./reference/rules.json";

test.each(examples)(
  "published $id, PDF p. $pdfPage section $section",
  (example) => {
    const row = editions
      .find((edition) => edition.edition === example.edition)!
      .rows.find((row) => row.field === example.field)!;
    const ctx = contextFor(
      example.edition,
      row,
      example.groups,
      example.specialFeatures,
    );
    ctx.wohnflaeche = Number(example.area);
    const specialCents = example.specialFeatures.reduce(
      (sum, name) =>
        sum +
        rules.specialFeatures2015.amountsCents[
          name as keyof typeof rules.specialFeatures2015.amountsCents
        ][rules.specialFeatures2015.periods.indexOf(row.period)],
      0,
    );
    expect(referencePerSqmCents(row, example.groups, 0, specialCents)).toBe(
      example.expectedPerSqmCents,
    );
    expect(getWorstBestOrtsueblicheVergleichsmiete(ctx)).toEqual({
      best: example.expectedPerSqmCents / 100,
      worst: example.expectedPerSqmCents / 100,
    });
    // Monthly amounts are our independently derived standard scenario, not a PDF claim about legal eligibility.
    expect(
      referenceMonthlyCents(example.expectedPerSqmCents, example.area, true),
    ).toBe(example.standardNewTenancyMonthlyCents);
    expect(getWorstBestZulaessigeHoechstmiete(ctx)).toEqual({
      best: example.standardNewTenancyMonthlyCents / 100,
      worst: example.standardNewTenancyMonthlyCents / 100,
    });
  },
);
