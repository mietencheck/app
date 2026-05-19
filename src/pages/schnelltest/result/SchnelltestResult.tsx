import type { ReactNode } from "react";

import { Button, Link } from "~/components";
import {
  getGeforderteNettokaltmiete,
  getNettokaltmiete,
  getTyp,
} from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useInlineLocale } from "~/l10n";
import { DetailsRouter } from "~/pages/fragebogen/router";
import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/pages/fragebogen/utils";

import { StepperType } from "..";
import { useMarkEstimatorSeen } from "../utils";
import { ResultMieteNichtZulaessig } from "./miete/ResultMieteNichtZulaessig";
import { ResultMieteZulaessig } from "./miete/ResultMieteZulaessig";
import { ResultMieterhoehungPotentiellUnzulaessig } from "./mieterhoehung/ResultMietePotentiellUnzulaessig";
import { ResultMieterhoehungNichtZulaessig } from "./mieterhoehung/ResultMieterhoehungNichtZulaessig";
import { ResultMieterhöhungZulaessig } from "./mieterhoehung/ResultMieterhoehungZulaessig";

export function SchnelltestResult({ stepper }: { stepper: StepperType }) {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  const zulaessigeHoechstmiete = useWorstBestZulaessigeHoechstmiete();
  const zulaessigeHoechstmieteDiff = useWorstBestZulaessigeHoechstmieteDiff();

  const typ = getTyp(answers, visibleQuestionAliases);

  const l = useInlineLocale();

  useMarkEstimatorSeen();

  const errorState = (
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

  let showContinueToDetailsButton = false;
  let resultContent: ReactNode = errorState;

  if (typ === "Miete") {
    if (zulaessigeHoechstmieteDiff) {
      const { best: bestZulaessigeHoechstmieteDiff } =
        zulaessigeHoechstmieteDiff;

      if (bestZulaessigeHoechstmieteDiff < 0) {
        // Die aktuelle Miete liegt im (oder unter dem) zulässigen Bereich.
        resultContent = <ResultMieteZulaessig />;
      } else {
        // Die aktuelle Miete liegt über dem zulässigen Bereich;
        // daher Weiterleitung zum vollständigen Fragebogen anbieten.
        showContinueToDetailsButton = true;
        resultContent = <ResultMieteNichtZulaessig />;
      }
    }
  } else {
    const nettokaltmiete = getNettokaltmiete(answers, visibleQuestionAliases);
    const geforderteNettokaltmiete = getGeforderteNettokaltmiete(
      answers,
      visibleQuestionAliases,
    );

    if (nettokaltmiete && geforderteNettokaltmiete && zulaessigeHoechstmiete) {
      const {
        best: bestZulaessigeHoechstmiete,
        worst: worstZulaessigeHoechstmiete,
      } = zulaessigeHoechstmiete;

      if (geforderteNettokaltmiete < bestZulaessigeHoechstmiete) {
        /*
          Fall 1:
          Die geforderte Nettokaltmiete liegt unter der niedrigsten möglichen
          zulässigen Höchstmiete.
          -> Die Mieterhöhung ist voraussichtlich zulässig.
        */
        resultContent = <ResultMieterhöhungZulaessig />;
      } else if (geforderteNettokaltmiete < worstZulaessigeHoechstmiete) {
        /*
          Fall 2:
          Die geforderte Nettokaltmiete liegt zwischen niedrigster möglicher und
          höchster möglicher zulässiger Höchstmiete.
          -> Die Erhöhung könnte unzulässig sein (abhängig von Details).
          -> Weiter zum vollständigen Fragebogen anbieten.
        */
        showContinueToDetailsButton = true;
        resultContent = <ResultMieterhoehungPotentiellUnzulaessig />;
      } else if (nettokaltmiete < worstZulaessigeHoechstmiete) {
        /*
          Fall 3:
          Die geforderte Nettokaltmiete liegt über der höchsten möglichen
          zulässigen Höchstmiete, die aktuelle Nettokaltmiete aber noch darunter.
          -> Die geforderte Erhöhung könnte zu hoch sein, die exakte rechtliche
             Bewertung hängt von weiteren Details ab.
          -> Weiter zum vollständigen Fragebogen anbieten.
        */
        showContinueToDetailsButton = true;
        resultContent = <ResultMieterhoehungPotentiellUnzulaessig />;
      } else {
        /*
          Fall 4:
          Sowohl aktuelle als auch geforderte Nettokaltmiete liegen über der
          höchsten möglichen zulässigen Höchstmiete.
          -> Eine weitere Erhöhung ist voraussichtlich unzulässig.
        */
        resultContent = <ResultMieterhoehungNichtZulaessig />;
      }
    }
  }

  return (
    <>
      <p className="text-base text-gray-11 mb-2">
        {l({ de: "Prognose", en: "Prediction" })}
      </p>
      {resultContent}

      <div className="flex flex-row flex-wrap justify-center gap-3 mt-10">
        {stepper.back && (
          <Button
            variant="outline"
            color="gray"
            type="button"
            onClick={stepper.back}
          >
            {l({ de: "Zurück", en: "Back" })}
          </Button>
        )}
        {showContinueToDetailsButton ? (
          <Link variant="solid" href={DetailsRouter.Summary()}>
            {l({ de: "Weiter zu den Details", en: "Go to details" })}
          </Link>
        ) : (
          <Button
            variant="solid"
            type="button"
            onClick={() => {
              localStorage.clear();
              location.reload();
            }}
          >
            {l({ de: "Neu Anfangen", en: "Restart" })}
          </Button>
        )}
      </div>
    </>
  );
}
