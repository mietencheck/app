export type WorstBest = { worst: number; best: number };

export type MieteErgebnisKind = "zulaessig" | "eventuell_zu_hoch" | "zu_hoch";

export type MieteErgebnis = {
  kind: MieteErgebnisKind;
  zulaessigeHoechstmiete: WorstBest;
  diff: WorstBest;
  hasRange: boolean;
};

export function getMieteDiff(
  nettokaltmiete: number,
  zulaessigeHoechstmiete: WorstBest,
): WorstBest {
  return {
    worst: Number(
      (Number(nettokaltmiete) - zulaessigeHoechstmiete.worst).toFixed(2),
    ),
    best: Number(
      (Number(nettokaltmiete) - zulaessigeHoechstmiete.best).toFixed(2),
    ),
  };
}

export function classifyMieteErgebnis(diff: WorstBest): MieteErgebnisKind {
  if (diff.best <= 0) {
    return "zulaessig";
  }

  if (diff.worst > 0) {
    return "zu_hoch";
  }

  return "eventuell_zu_hoch";
}

export function hasZulaessigeHoechstmieteRange(
  zulaessigeHoechstmiete: WorstBest,
): boolean {
  return zulaessigeHoechstmiete.worst !== zulaessigeHoechstmiete.best;
}

export function analyzeMieteErgebnis(
  zulaessigeHoechstmiete: WorstBest,
  diff: WorstBest,
): MieteErgebnis {
  return {
    kind: classifyMieteErgebnis(diff),
    zulaessigeHoechstmiete,
    diff,
    hasRange: hasZulaessigeHoechstmieteRange(zulaessigeHoechstmiete),
  };
}
