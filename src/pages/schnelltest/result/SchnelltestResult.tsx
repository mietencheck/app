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
  useMieteErgebnis,
  useWorstBestZulaessigeHoechstmiete,
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
  const mieteResult = useMieteErgebnis();
  const zulaessigeHoechstmiete = useWorstBestZulaessigeHoechstmiete();

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
    if (mieteResult) {
      if (mieteResult.kind === "zulaessig") {
        resultContent = <ResultMieteZulaessig result={mieteResult} />;
      } else {
        showContinueToDetailsButton = true;
        resultContent = <ResultMieteNichtZulaessig result={mieteResult} />;
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
        resultContent = <ResultMieterhöhungZulaessig />;
      } else if (geforderteNettokaltmiete < worstZulaessigeHoechstmiete) {
        showContinueToDetailsButton = true;
        resultContent = <ResultMieterhoehungPotentiellUnzulaessig />;
      } else if (nettokaltmiete < worstZulaessigeHoechstmiete) {
        showContinueToDetailsButton = true;
        resultContent = <ResultMieterhoehungPotentiellUnzulaessig />;
      } else {
        resultContent = <ResultMieterhoehungNichtZulaessig />;
      }
    }
  }

  return (
    <>
      <p className="text-base text-gray-11 mb-2">
        {l({ de: "Prognose", en: "Prediction" })}
      </p>
      <div className="typography">{resultContent}</div>

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
