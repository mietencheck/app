/** Independent test oracle. No imports from production calculation or data. */
export type ReferenceRow = {
  tabellenfeld: string;
  pdfPage: number;
  baujahrSpanne: string;
  wohnlage: string;
  minWohnflaeche: number;
  maxWohnflaecheExclusive: number | null;
  mittelwertInCent: number | null;
  unterwertInCent: number | null;
  oberwertInCent: number | null;
  tabellenfeldAnnotation: string | null;
};

export function roundRatio(numerator: bigint, denominator: bigint): number {
  const sign = numerator < 0n ? -1 : 1;
  const absolute = numerator < 0n ? -numerator : numerator;
  return sign * Number((absolute * 2n + denominator) / (denominator * 2n));
}

export function referenceVergleichsmietePerQmInCent(
  row: ReferenceRow,
  merkmalsgruppen: readonly number[],
  ausstattungsAbzugInCent = 0,
  sondermerkmalZuAbschlagInCent = 0,
): number {
  if (
    row.mittelwertInCent === null ||
    row.unterwertInCent === null ||
    row.oberwertInCent === null
  ) {
    throw new Error("No published Miete for this Tabellenfeld");
  }
  const mittelwert = row.mittelwertInCent - ausstattungsAbzugInCent;
  const unterwert = row.unterwertInCent - ausstattungsAbzugInCent;
  const oberwert = row.oberwertInCent - ausstattungsAbzugInCent;
  const mittelwertWithSondermerkmale =
    mittelwert + sondermerkmalZuAbschlagInCent;
  if (
    mittelwertWithSondermerkmale < unterwert ||
    mittelwertWithSondermerkmale > oberwert
  )
    return mittelwertWithSondermerkmale;
  const merkmalsgruppenSaldo = merkmalsgruppen.reduce(
    (sum, merkmalsgruppe) => sum + Math.sign(merkmalsgruppe),
    0,
  );
  const distanceToSpannenendwert =
    merkmalsgruppenSaldo < 0 ? mittelwert - unterwert : oberwert - mittelwert;
  // Work in fifths of a cent until the final half-up rounding.
  const fifths = Math.max(
    unterwert * 5,
    Math.min(
      oberwert * 5,
      mittelwertWithSondermerkmale * 5 +
        merkmalsgruppenSaldo * distanceToSpannenendwert,
    ),
  );
  return roundRatio(BigInt(fifths), 5n);
}

export function referenceMonthlyHoechstmieteInCent(
  vergleichsmietePerQmInCent: number,
  wohnflaeche: string,
  withTenPercentAufschlag: boolean,
): number {
  const [whole, fraction = ""] = wohnflaeche.split(".");
  const wohnflaecheUnits = BigInt(whole + fraction);
  const wohnflaecheScale = 10n ** BigInt(fraction.length);
  return roundRatio(
    BigInt(vergleichsmietePerQmInCent) *
      wohnflaecheUnits *
      (withTenPercentAufschlag ? 11n : 10n),
    wohnflaecheScale * 10n,
  );
}
