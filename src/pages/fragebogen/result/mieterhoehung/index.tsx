import { Button } from "~/components";
import { getGeforderteNettokaltmiete, getNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useInlineLocale } from "~/l10n";
import { useWorstBestZulaessigeHoechstmiete } from "~/pages/fragebogen/utils";

import { ResultMieterhoehungChecks } from "./partials/checks";
import {
  ResultMieterhoehungHoechstmieteEventuellUeberschritten,
  ResultMieterhoehungNichtZulaessig,
  ResultMieterhoehungZulaessig,
} from "./partials/result";

export type ResultMieterhoehungTypes =
  | "Zulässig"
  | "Höchstmiete eventuell überschritten"
  | "Höchstmiete überschritten";

export function ResultMieterhoehung() {
  const l = useInlineLocale();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const zulaessigeHoechstmiete = useWorstBestZulaessigeHoechstmiete();

  const nettokaltmiete = getNettokaltmiete(answers, visibleQuestionAliases);
  const geforderteNettokaltmiete = getGeforderteNettokaltmiete(
    answers,
    visibleQuestionAliases,
  );

  if (!nettokaltmiete || !geforderteNettokaltmiete || !zulaessigeHoechstmiete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <h2 className="heading-24 mb-4">
          {l({
            de: "Fehler beim Berechnen des Ergebnisses",
            en: "Error calculating the result",
          })}
        </h2>
        <p className="text-gray-11 mb-4">
          {l({
            de: 'Es ist ein Fehler beim Berechnen des Ergebnisses aufgetreten. Bitte klick unten auf "Neu anfangen".',
            en: 'An error occurred while calculating the result. Please click "Start over" below.',
          })}
        </p>
      </div>
    );
  }

  const {
    worst: worstZulaessigeHoechstmiete,
    best: bestZulaessigeHoechstmiete,
  } = zulaessigeHoechstmiete;

  let result: ResultMieterhoehungTypes;

  if (geforderteNettokaltmiete <= bestZulaessigeHoechstmiete) {
    result = "Zulässig";
  } else if (nettokaltmiete < worstZulaessigeHoechstmiete) {
    result = "Höchstmiete eventuell überschritten";
  } else {
    result = "Höchstmiete überschritten";
  }

  return (
    <div className="">
      <div className="typography [&>h1]:mb-10">
        {
          {
            Zulässig: (
              <ResultMieterhoehungZulaessig
                nettokaltmiete={nettokaltmiete}
                geforderteNettokaltmiete={geforderteNettokaltmiete}
              />
            ),
            "Höchstmiete überschritten": (
              <ResultMieterhoehungNichtZulaessig
                nettokaltmiete={nettokaltmiete}
                geforderteNettokaltmiete={geforderteNettokaltmiete}
                worstZulaessigeHoechstmiete={worstZulaessigeHoechstmiete}
                bestZulaessigeHoechstmiete={bestZulaessigeHoechstmiete}
              />
            ),
            "Höchstmiete eventuell überschritten": (
              <ResultMieterhoehungHoechstmieteEventuellUeberschritten
                nettokaltmiete={nettokaltmiete}
                geforderteNettokaltmiete={geforderteNettokaltmiete}
                worstZulaessigeHoechstmiete={worstZulaessigeHoechstmiete}
                bestZulaessigeHoechstmiete={bestZulaessigeHoechstmiete}
              />
            ),
          }[result]
        }
        <hr />
        <h2>{l({ de: "Was wir geprüft haben", en: "What we checked" })}</h2>
        <ResultMieterhoehungChecks result={result} />
        <div className="mt-6">
          <Button variant="outline" color="gray" size="sm" type="button">
            {l({
              de: "Gesamte Auswertung ansehen",
              en: "View full assessment",
            })}
          </Button>
        </div>
        <hr />
        <h2>{l({ de: "Ergebnis speichern", en: "Save result" })}</h2>
        <p>
          {l({
            de: "Wenn du das Ergebnis für eine Mietberatung verwenden möchtest, ist es wichtig, dass du das Ergebnis speicherst.",
            en: "If you want to use the result for tenant counselling, it is important that you save the result.",
          })}
        </p>
        <p>
          {l({
            de: 'Klicke hierfür einfach auf "Ergebnis speichern" unterhalb. Du erhältst dann einen einzigartigen Link, mit welchem du dein Ergebnis jederzeit wieder aufrufen und auch Antworten ändern kannst. Alternativ, kannst du dir das Ergebnis auch als PDF herunterladen.',
            en: 'Simply click on "Save result" below. You will then receive a unique link with which you can access your result at any time and also change your answers. Alternatively, you can also download the result as a PDF.',
          })}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="solid" size="sm" type="button">
            {l({ de: "Ergebnis speichern", en: "Save result" })}
          </Button>
          <Button variant="outline" color="gray" size="sm" type="button">
            {l({
              de: "Auswertung als PDF herunterladen",
              en: "Download assessment as PDF",
            })}
          </Button>
        </div>
        <hr />
        <h2>{l({ de: "Disclaimer", en: "Disclaimer" })}</h2>
        <p>
          {l({
            de: "Dieses Ergebnis basiert auf deinen Angaben und ersetzt keine rechtliche Beratung. Im Einzelfall kann die rechtliche Bewertung anders ausfallen.",
            en: "This result is based on your information and does not replace legal advice. In individual cases, the legal assessment may differ.",
          })}
        </p>
        <p>
          {l({
            de: "Im Zweifel wende dich bitte an eine ",
            en: "If in doubt, please contact a ",
          })}
          <a href="TODO">
            {l({ de: "Mietberatung", en: "tenant advisory service" })}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
