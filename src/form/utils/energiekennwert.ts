import type { Mietspiegeljahr } from "../../mietspiegel/types";
import type { FinalAnswers } from "../flow-machine-runtime";
import { answersToMerkmalStateMapping } from "../mappings/merkmale";
import { mapAnswerToMerkmalState } from "./mapAnswerToMerkmalState";
import type {
  MerkmalState,
  MerkmalStateList,
} from "./mapMerkmalStateToMerkmalGruppen";

/** Orientierungshilfe, Gebäude energy box (2015–2026).
 * The 20 kWh adjustment precedes comparison with the Bedarf limits (+20%).
 * Do not add it twice: Berlin's official Urteilssammlung also records this
 * for Bedarf certificates (LG Berlin, 08.07.2020, 64 S 194/19).
 */
export function getEnergiekennwertStates(
  answers: FinalAnswers,
  visible: Set<string>,
  jahr: Mietspiegeljahr,
): MerkmalStateList {
  const alias = "Energiekennwert laut Energieausweis";
  if (answers.Typ !== "Miete" || !visible.has(alias)) return {};

  const raw = answers[alias];
  const kennwertTyp = answers["Kennt Energieverbrauch oder Energiebedarf"];
  const legacyAlias =
    kennwertTyp === "Energieverbrauchswert"
      ? "Energieverbrauchskennwert"
      : kennwertTyp === "Ernergiebedarfswert"
        ? "Energiebedarfskennwert"
        : undefined;
  // Saved band answers predate the numeric questionnaire. Keep their existing
  // result until a numeric value is supplied; never infer a raw value or backfill.
  if (raw == null && legacyAlias && answers[legacyAlias] !== undefined) {
    const legacyVisible = new Set([legacyAlias]);
    return Object.fromEntries(
      Object.entries(answersToMerkmalStateMapping)
        .filter(([merkmal]) => merkmal.includes("Energieverbrauchskennwert"))
        .map(([merkmal, mapping]) => [
          merkmal,
          mapAnswerToMerkmalState(mapping, answers, legacyVisible),
        ]),
    );
  }
  // The browser number control stores strings until API normalization.
  const kennwert =
    typeof raw === "number" ||
    (typeof raw === "string" && String(raw).trim() !== "")
      ? Number(raw)
      : NaN;
  const dezentral = visible.has("Warmwasserversorgung ist dezentral")
    ? answers["Warmwasserversorgung ist dezentral"]
    : undefined;
  const enthalten = visible.has(
    "Dezentrales Warmwasser im Energiekennwert enthalten",
  )
    ? answers["Dezentrales Warmwasser im Energiekennwert enthalten"]
    : undefined;

  const zuschlaege =
    dezentral === "Nein" || enthalten === "Ja"
      ? [0]
      : dezentral === "Ja" && enthalten === "Nein"
        ? [20]
        : [0, 20];
  const faktor = kennwertTyp === "Ernergiebedarfswert" ? 1.2 : 1;
  const valid =
    Number.isFinite(kennwert) &&
    kennwert >= 0 &&
    (kennwertTyp === "Energieverbrauchswert" ||
      kennwertTyp === "Ernergiebedarfswert");

  function state(
    grenze: number,
    richtung: "groesser" | "kleiner",
  ): MerkmalState {
    if (!valid) return "maybe";
    const results = zuschlaege.map((zuschlag) =>
      richtung === "groesser"
        ? kennwert + zuschlag > grenze * faktor
        : kennwert + zuschlag < grenze * faktor,
    );
    if (results.every(Boolean)) return "checked";
    if (results.some(Boolean)) return "maybe";
    return "unchecked";
  }

  return {
    "[Gebäude-] Energieverbrauchskennwert größer als 170/155/145": state(
      jahr === "2015" ? 170 : jahr === "2024" || jahr === "2026" ? 145 : 155,
      "groesser",
    ),
    "[Gebäude-] Energieverbrauchskennwert größer als 210/195": state(
      jahr === "2015" ? 210 : 195,
      "groesser",
    ),
    "[Gebäude-] Energieverbrauchskennwert größer als 250/235": state(
      jahr === "2015" ? 250 : 235,
      "groesser",
    ),
    "[Gebäude+] Energieverbrauchskennwert kleiner als 120": state(
      120,
      "kleiner",
    ),
    "[Gebäude+] Energieverbrauchskennwert kleiner als 100": state(
      100,
      "kleiner",
    ),
    "[Gebäude+] Energieverbrauchskennwert kleiner als 80": state(80, "kleiner"),
  };
}
