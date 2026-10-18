/** Independent test oracle. No imports from production calculation or data. */
export type ReferenceRow = {
  field: string;
  pdfPage: number;
  period: string;
  location: string;
  minArea: number;
  maxArea: number | null;
  medianCents: number | null;
  lowerCents: number | null;
  upperCents: number | null;
  qualification: string | null;
};

export function roundRatio(numerator: bigint, denominator: bigint): number {
  const sign = numerator < 0n ? -1 : 1;
  const absolute = numerator < 0n ? -numerator : numerator;
  return sign * Number((absolute * 2n + denominator) / (denominator * 2n));
}

export function referencePerSqmCents(
  row: ReferenceRow,
  groups: readonly number[],
  deductionCents = 0,
  specialCents = 0,
): number {
  if (
    row.medianCents === null ||
    row.lowerCents === null ||
    row.upperCents === null
  ) {
    throw new Error("No published rent for this field");
  }
  const median = row.medianCents - deductionCents;
  const lower = row.lowerCents - deductionCents;
  const upper = row.upperCents - deductionCents;
  const specialBase = median + specialCents;
  if (specialBase < lower || specialBase > upper) return specialBase;
  const balance = groups.reduce((sum, group) => sum + Math.sign(group), 0);
  const distance = balance < 0 ? median - lower : upper - median;
  // Work in fifths of a cent until the final half-up rounding.
  const fifths = Math.max(
    lower * 5,
    Math.min(upper * 5, specialBase * 5 + balance * distance),
  );
  return roundRatio(BigInt(fifths), 5n);
}

export function referenceMonthlyCents(
  perSqmCents: number,
  area: string,
  newTenancy: boolean,
): number {
  const [whole, fraction = ""] = area.split(".");
  const areaUnits = BigInt(whole + fraction);
  const areaScale = 10n ** BigInt(fraction.length);
  return roundRatio(
    BigInt(perSqmCents) * areaUnits * (newTenancy ? 11n : 10n),
    areaScale * 10n,
  );
}
