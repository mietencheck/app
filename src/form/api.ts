import { entries, fromEntries } from "remeda";

import { FinalAnswers } from "~/form/flow-machine";
import { merkmaleByYear } from "~/mietspiegel/merkmale";
import { parseAdresse } from "~/utils";
import {
  getSelectedWohnflaecheSpanne,
  getWohnflaecheSpanneOptions,
} from "~/utils/wohnflaecheSpanne";

import { baujahrSpannenByMietspiegeljahr } from "../mietspiegel/baujahrSpannen";
import { Mietspiegeljahr } from "../mietspiegel/types";
import {
  AnswerMerkmalStateMapping,
  answersToMerkmalStateMapping,
} from "./mappings/merkmale";
import { answersToSondermerkmalStateMapping } from "./mappings/sondermerkmale";
import { vertragsdatumToMietspiegelJahrMapping } from "./mappings/vertragsdatum";
import { mapAnswerToMerkmalState } from "./utils/mapAnswerToMerkmalState";
import {
  mapMerkmalStateToMerkmalGruppen,
  MerkmalGruppenStateList,
  MerkmalState,
  MerkmalStateList,
  SondermerkmalStateList,
} from "./utils/mapMerkmalStateToMerkmalGruppen";

export const getTyp = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Typ";
  return answers && visibleQuestionAliases?.has(alias)
    ? answers[alias]
    : undefined;
};

export const getMietspiegeljahr = (
  answers: FinalAnswers,
): Mietspiegeljahr | undefined => {
  const alias = "Vertragsdatum";

  // If contract is not signed, use newest Mietspiegel
  if (answers["Unterschrieben"] == "Nein") {
    return "2026";
  }

  return answers[alias]
    ? vertragsdatumToMietspiegelJahrMapping[answers[alias]]
    : undefined;
};

export const getAdresse = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): ReturnType<typeof parseAdresse> | undefined => {
  const alias = "Adresse";
  return answers[alias] && visibleQuestionAliases.has(alias)
    ? parseAdresse(answers[alias] as string)
    : undefined;
};

export const getOst = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): boolean => {
  const alias = "Ost";
  return answers[alias] && visibleQuestionAliases.has(alias)
    ? answers[alias]
    : false;
};

export const getWohnlage = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Wohnlage";
  return answers[alias] && visibleQuestionAliases.has(alias)
    ? answers[alias]
    : undefined;
};

export const getWohnflaeche = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Qm";
  return answers && visibleQuestionAliases?.has(alias)
    ? Number(answers[alias])
    : undefined;
};

export const getWohnflaecheSpanne = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const mietspiegeljahr = getMietspiegeljahr(answers);
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);
  const wohnlage = getWohnlage(answers, visibleQuestionAliases);
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);

  if (wohnflaeche === undefined || Number.isNaN(wohnflaeche)) return undefined;
  const wohnflaecheSpanneOptions = getWohnflaecheSpanneOptions(
    mietspiegeljahr,
    baujahrSpanne,
    wohnlage,
  );
  return getSelectedWohnflaecheSpanne(wohnflaeche, wohnflaecheSpanneOptions);
};

export const getVertragsart = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Mietart";
  return answers && visibleQuestionAliases?.has(alias)
    ? answers[alias]
    : undefined;
};

export const getBaujahr = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Baujahr";
  return answers && visibleQuestionAliases?.has(alias)
    ? Number(answers[alias])
    : undefined;
};

export const getBaujahrSpanne = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const mietspiegeljahr = getMietspiegeljahr(answers);
  const baujahr = getBaujahr(answers, visibleQuestionAliases);
  const ost = getOst(answers, visibleQuestionAliases);

  if (baujahr && mietspiegeljahr) {
    const baujahrSpannen =
      baujahrSpannenByMietspiegeljahr[mietspiegeljahr as Mietspiegeljahr];

    return baujahrSpannen.find((baujahrSpanne) => {
      const [start, end] = baujahrSpanne
        .replace(/^(W:|O:)/, "")
        .split("-")
        .map(Number);
      const isOst = baujahrSpanne.includes("O:");
      const isWest = baujahrSpanne.includes("W:");

      const matchesOstWest =
        (!isOst && !isWest) || // No specific region
        (isOst && ost === true) || // Matches East
        (isWest && ost === false); // Matches West

      return baujahr >= start && baujahr <= end && matchesOstWest;
    });
  }

  return undefined;
};

export const getNettokaltmiete = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): number | undefined => {
  const alias = "Nettokaltmiete";
  return answers[alias] && visibleQuestionAliases?.has(alias)
    ? Number(answers[alias])
    : undefined;
};

export const getGeforderteNettokaltmiete = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): number | undefined => {
  const alias = "Geforderte Nettokaltmiete";
  return answers[alias] && visibleQuestionAliases?.has(alias)
    ? Number(answers[alias])
    : undefined;
};

export const getAusstattung = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias_sh = "Wohnung hat Sammelheizung";
  const alias_bad = "Badezimmer in Wohnung";

  return {
    sammelheizung:
      answers[alias_sh] && visibleQuestionAliases?.has(alias_sh)
        ? answers[alias_sh]
        : "Nein",
    bad:
      answers[alias_bad] && visibleQuestionAliases?.has(alias_bad)
        ? answers[alias_bad]
        : "Nein",
  };
};

export const getMerkmalStatesByGruppe = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): MerkmalGruppenStateList => {
  const merkmale = getMerkmalStates(answers, visibleQuestionAliases);
  return mapMerkmalStateToMerkmalGruppen(merkmale);
};

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
  // TODO(#62): Explain where users can find warm-water inclusion on their certificate.
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

  const [ersteGrenze, zweiteGrenze, dritteGrenze] = {
    "2015": [170, 210, 250],
    "2017": [155, 195, 235],
    "2019": [155, 195, 235],
    "2021": [155, 195, 235],
    "2023": [155, 195, 235],
    "2024": [145, 195, 235],
    "2026": [145, 195, 235],
  }[jahr];

  return {
    "[Gebäude-] Energieverbrauchskennwert größer als 170/155/145": state(
      ersteGrenze,
      "groesser",
    ),
    "[Gebäude-] Energieverbrauchskennwert größer als 210/195": state(
      zweiteGrenze,
      "groesser",
    ),
    "[Gebäude-] Energieverbrauchskennwert größer als 250/235": state(
      dritteGrenze,
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

export const getMerkmalStates = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): MerkmalStateList => {
  const mietspiegelJahr = getMietspiegeljahr(answers);

  if (mietspiegelJahr) {
    const merkmale = merkmaleByYear[mietspiegelJahr];
    const energiekennwertStates = getEnergiekennwertStates(
      answers,
      visibleQuestionAliases,
      mietspiegelJahr,
    );

    // Apply the #63 exception after either energy path, including numeric values.
    // Its question is supplied by the separate Denkmalschutz questionnaire change.
    const ausnahmeAlias = "Denkmalschutz verhindert energetische Sanierung";
    const denkmalschutz =
      answers.Typ === "Miete" && visibleQuestionAliases.has(ausnahmeAlias)
        ? (answers as Record<string, unknown>)[ausnahmeAlias]
        : undefined;

    return fromEntries(
      entries(answersToMerkmalStateMapping)
        .filter(([merkmal]) => merkmale.has(merkmal))
        .map(
          ([key, answerMerkmalMapping]: [
            string,
            AnswerMerkmalStateMapping,
          ]) => {
            const state =
              energiekennwertStates[key as keyof MerkmalStateList] ??
              mapAnswerToMerkmalState(
                answerMerkmalMapping,
                answers,
                visibleQuestionAliases,
              );
            const istNegativesEnergiemerkmal =
              key === "[Gebäude-] Gebäude hat unzureichende Wärmedämmung" ||
              key.startsWith("[Gebäude-] Energieverbrauchskennwert");
            if (istNegativesEnergiemerkmal) {
              if (denkmalschutz === "Ja") return [key, "unchecked"];
              if (denkmalschutz === "Nicht sicher" && state === "checked")
                return [key, "maybe"];
            }
            return [key, state];
          },
        ),
    );
  }
  return {};
};

export const getSondermerkmalStates = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): SondermerkmalStateList | undefined => {
  const mietspiegeljahr = getMietspiegeljahr(answers);

  if (mietspiegeljahr == "2015") {
    return fromEntries(
      entries(answersToSondermerkmalStateMapping).map(
        ([key, answerMerkmalMapping]: [string, any]) => {
          return [
            key,
            mapAnswerToMerkmalState(
              answerMerkmalMapping,
              answers,
              visibleQuestionAliases,
            ),
          ];
        },
      ),
    ) as SondermerkmalStateList;
  }

  return undefined;
};
