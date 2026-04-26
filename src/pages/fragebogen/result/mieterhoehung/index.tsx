import { Button } from "~/components";
import { getGeforderteNettokaltmiete, getNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
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
          Fehler beim Berechnen des Ergebnisses
        </h2>
        <p className="text-neutral-faded mb-4">
          Es ist ein Fehler beim Berechnen des Ergebnisses aufgetreten. Bitte
          klick unten auf "Neu anfangen".
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
        <h2>Was wir geprüft haben</h2>
        <ResultMieterhoehungChecks result={result} />
        <div className="mt-6">
          <Button size="sm">Gesamte Auswertung ansehen</Button>
        </div>
        <hr />
        <h2>Ergebnis speichern</h2>
        <p>
          Wenn du das Ergebnis für eine Mietberatung verwenden möchtest, ist es
          wichtig, dass du das Ergebnis speicherst.
        </p>
        <p>
          Klicke hierfür einfach auf "Ergebnis speichern" unterhalb. Du erhältst
          dann einen einzigartigen Link, mit welchem du dein Ergebnis jederzeit
          wieder aufrufen und auch Antworten ändern kannst. Alternativ, kannst
          du dir das Ergebnis auch als PDF herunterladen.
        </p>
        <div className="mt-6 flex gap-3">
          <Button color="primary" variant="solid" size="sm">
            Ergebnis speichern
          </Button>
          <Button size="sm">Auswertung als PDF herunterladen</Button>
        </div>
        <hr />
        <h2>Disclaimer</h2>
        <p>
          Dieses Ergebnis basiert auf deinen Angaben und ersetzt keine
          rechtliche Beratung. Im Einzelfall kann die rechtliche Bewertung
          anders ausfallen.
        </p>
        <p>
          Im Zweifel wende dich bitte an eine <a href="TODO">Mietberatung</a>.
        </p>
      </div>
    </div>
  );
}
