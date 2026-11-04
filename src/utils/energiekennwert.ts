import type { MerkmalStateList } from "~/form/utils/mapMerkmalStateToMerkmalGruppen";
import type { Merkmal, Mietspiegeljahr } from "~/mietspiegel/types";

type EnergiekennwertOption = {
  merkmal: Merkmal;
  grenze: number;
  vergleich: "groesser" | "kleiner";
};

/** Bedarf limits are 20% higher than the Verbrauch limits. */
export function getEnergiekennwertOptions(
  mietspiegeljahr: Mietspiegeljahr,
  ausweisart: "verbrauch" | "bedarf",
): EnergiekennwertOption[] {
  const [erste, zweite, dritte] = {
    "2015": [170, 210, 250],
    "2017": [155, 195, 235],
    "2019": [155, 195, 235],
    "2021": [155, 195, 235],
    "2023": [155, 195, 235],
    "2024": [145, 195, 235],
    "2026": [145, 195, 235],
  }[mietspiegeljahr];
  const options: EnergiekennwertOption[] = [
    {
      merkmal: "[Gebäude-] Energieverbrauchskennwert größer als 170/155/145",
      grenze: erste,
      vergleich: "groesser",
    },
    {
      merkmal: "[Gebäude-] Energieverbrauchskennwert größer als 210/195",
      grenze: zweite,
      vergleich: "groesser",
    },
    {
      merkmal: "[Gebäude-] Energieverbrauchskennwert größer als 250/235",
      grenze: dritte,
      vergleich: "groesser",
    },
    {
      merkmal: "[Gebäude+] Energieverbrauchskennwert kleiner als 120",
      grenze: 120,
      vergleich: "kleiner",
    },
    {
      merkmal: "[Gebäude+] Energieverbrauchskennwert kleiner als 100",
      grenze: 100,
      vergleich: "kleiner",
    },
    {
      merkmal: "[Gebäude+] Energieverbrauchskennwert kleiner als 80",
      grenze: 80,
      vergleich: "kleiner",
    },
  ];
  const faktor = ausweisart === "bedarf" ? 1.2 : 1;
  return options.map((option) => ({
    ...option,
    grenze: option.grenze * faktor,
  }));
}

/** Only thresholds crossed by the possible additions become uncertain. */
export function getEnergiekennwertBewertung(
  wert: unknown,
  zuschlaege: readonly number[],
  options: EnergiekennwertOption[],
): MerkmalStateList {
  const kennwert =
    typeof wert === "number" || (typeof wert === "string" && wert.trim() !== "")
      ? Number(wert)
      : NaN;
  const valid = Number.isFinite(kennwert) && kennwert >= 0;
  const bewertung: MerkmalStateList = {};

  for (const { merkmal, grenze, vergleich } of options) {
    if (!valid) {
      bewertung[merkmal] = "maybe";
      continue;
    }
    const ergebnisse = zuschlaege.map((zuschlag) =>
      vergleich === "groesser"
        ? kennwert + zuschlag > grenze
        : kennwert + zuschlag < grenze,
    );
    bewertung[merkmal] = ergebnisse.every(Boolean)
      ? "checked"
      : ergebnisse.some(Boolean)
        ? "maybe"
        : "unchecked";
  }

  return bewertung;
}
