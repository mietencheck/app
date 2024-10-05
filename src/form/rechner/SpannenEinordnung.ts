import { values } from "remeda";

import { isKeyOfObject, parseAdresse } from "~/utils";

import {
  EstimateAnswers,
  FinalAnswers,
  getMietspiegelJahr,
  getOstWestBaujahr,
} from "../flow-machine";
import {
  ausstattungsAbzuegeByJahr,
  Mietspiegel,
  mietspiegelByJahr,
  MietspiegelJahr,
  QmWohnlage,
} from "../mietspiegel";
import { MerkmalState } from "./utils";

const filterMietspiegels = (jahr: string | null) =>
  (
    Object.entries(mietspiegelByJahr) as [MietspiegelJahr, Mietspiegel][]
  ).filter(([j]) => !jahr || j == jahr);

function getWohnlagenByBaujahr(
  baujahr: EstimateAnswers["Baujahr"],
  mietspiegel: Mietspiegel,
  ost?: boolean,
): QmWohnlage[] {
  if (
    (baujahr == "1973-1985" || baujahr == "1986-1990") &&
    typeof ost == "undefined"
  ) {
    return [mietspiegel["O:1973-1990"], mietspiegel["W:1973-1990"]];
  }

  const msBaujahr = getOstWestBaujahr(baujahr, ost ?? false);
  if (msBaujahr) {
    return [mietspiegel[msBaujahr]];
  }

  return Object.values(mietspiegel) as QmWohnlage[];
}

const getQmString = (qm: number) => {
  if (qm < 40) {
    return "-40";
  } else if (qm < 60) {
    return "40-60";
  } else if (qm < 90) {
    return "60-90";
  } else {
    return "90-";
  }
};

export function getWorstBestAusstattungsabzüge(answers: FinalAnswers): {
  worst: number;
  best: number;
} {
  const jahr = getMietspiegelJahr(answers.Vertragsdatum);
  const abzügeByJahr = jahr && ausstattungsAbzuegeByJahr[jahr];
  if (
    !answers.Baujahr ||
    !abzügeByJahr ||
    (!isKeyOfObject(answers.Baujahr, abzügeByJahr) &&
      answers.Baujahr != "Nicht sicher")
  ) {
    return { worst: 0, best: 0 };
  }

  const abzügeRaw =
    answers.Baujahr == "Nicht sicher"
      ? values(abzügeByJahr)
      : [abzügeByJahr[answers.Baujahr]];
  const abzüge = abzügeRaw.map((a) =>
    Array.isArray(a) ? { und: a[0], oder: a[1] } : { und: a, oder: a },
  );

  const ohneSh: MerkmalState = (
    {
      Ja: "unchecked",
      Nein: "checked",
      "Nicht sicher": "maybe",
    } as const
  )[answers["Wohnung hat Sammelheizung"] ?? "Nicht sicher"];
  const ohneBad = (
    {
      Ja: "unchecked",
      Nein: "checked",
      "Nicht sicher": "maybe",
    } as const
  )[answers["Badezimmer in Wohnung"] ?? "Nicht sicher"];

  const isMaybeOrChecked = (m: MerkmalState) => m == "checked" || m == "maybe";

  const best =
    isMaybeOrChecked(ohneSh) && isMaybeOrChecked(ohneBad)
      ? Math.max(...abzüge.map(({ und }) => und))
      : isMaybeOrChecked(ohneSh) || isMaybeOrChecked(ohneBad)
        ? Math.max(...abzüge.map(({ oder }) => oder))
        : 0;

  const worst =
    ohneSh == "checked" && ohneBad == "checked"
      ? Math.min(...abzüge.map(({ und }) => und))
      : ohneSh == "checked" || ohneBad == "checked"
        ? Math.min(...abzüge.map(({ oder }) => oder))
        : 0;

  return { worst: answers.Baujahr == "Nicht sicher" ? 0 : worst, best };
}

export type SpannenEinordnung = { center: number; min: number; max: number };
export function getSpannenEinordnung(v: FinalAnswers): SpannenEinordnung[] {
  const jahr = getMietspiegelJahr(v.Vertragsdatum);
  return filterMietspiegels(jahr).flatMap(([jahr, mietspiegel]) => {
    const { wohnlage, ost } =
      (jahr && v.Adresse && parseAdresse(v.Adresse)?.lage?.[jahr]) || {};

    const wohnlageByQm = getWohnlagenByBaujahr(v.Baujahr, mietspiegel, ost);

    const qm = Number(v.Qm);
    const qmMieteByWohnlage = wohnlageByQm.map((w) => w[getQmString(qm)]);

    const spanne = qmMieteByWohnlage.flatMap((q) =>
      wohnlage ? [q[wohnlage]] : Object.values(q),
    );

    const abzug = getWorstBestAusstattungsabzüge(v);

    return spanne
      .filter((n): n is [number, number, number] => Boolean(n))
      .flatMap(([center, min, max]) => {
        const best = {
          center: center - abzug.best,
          min: min - abzug.best,
          max: max - abzug.best,
        };
        if (abzug.worst == abzug.best) return [best];
        return [
          best,
          {
            center: center - abzug.worst,
            min: min - abzug.worst,
            max: max - abzug.worst,
          },
        ];
      });
  });
}
