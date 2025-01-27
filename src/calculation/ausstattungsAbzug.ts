import {
  getAusstattung,
  getBaujahrSpanne,
  getMietspiegeljahr,
} from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { ausstattungsAbzuegeByYear } from "~/mietspiegel/ausstattungsAbzuege";

/**
 * Calculates the worst and best possible Ausstattungsabzug ('facility discount') based on the provided answers.
 */
export function getWorstBestAusstattungsAbzug(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } | undefined {
  const mietspiegelJahr = getMietspiegeljahr(answers, visibleQuestionAliases);
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);
  const ausstattung = getAusstattung(answers, visibleQuestionAliases);

  if (
    !mietspiegelJahr ||
    !baujahrSpanne ||
    !ausstattung.sammelheizung ||
    !ausstattung.bad
  ) {
    return undefined;
  }

  const ausstattungsAbzuege =
    ausstattungsAbzuegeByYear[
      mietspiegelJahr as keyof typeof ausstattungsAbzuegeByYear
    ][
      baujahrSpanne as keyof (typeof ausstattungsAbzuegeByYear)[typeof mietspiegelJahr]
    ];

  if (!ausstattungsAbzuege) {
    return {
      best: 0,
      worst: 0,
    };
  }

  const isChecked = (m: "Ja" | "Nein" | "Nicht sicher") => m == "Nein";
  const isMaybeOrChecked = (m: "Ja" | "Nein" | "Nicht sicher") =>
    m == "Nein" || m == "Nicht sicher";

  const best =
    isMaybeOrChecked(ausstattung.sammelheizung) &&
    isMaybeOrChecked(ausstattung.bad)
      ? ausstattungsAbzuege["!SH && !Bad"]
      : isMaybeOrChecked(ausstattung.sammelheizung) ||
          isMaybeOrChecked(ausstattung.bad)
        ? ausstattungsAbzuege["!SH || !Bad"]
        : 0;
  const worst =
    isChecked(ausstattung.sammelheizung) && isChecked(ausstattung.bad)
      ? ausstattungsAbzuege["!SH && !Bad"]
      : isChecked(ausstattung.sammelheizung) || isChecked(ausstattung.bad)
        ? ausstattungsAbzuege["!SH || !Bad"]
        : 0;

  return {
    best: best,
    worst: worst,
  };
}
