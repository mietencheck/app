import { Button, LinkButton } from "~/components";
import {
  getAusgangsmiete,
  getGeforderteNettokaltmiete,
  getTyp,
} from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { DetailsRouter } from "~/pages/details/router";
import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/pages/details/utils";

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

  const typ = getTyp(answers, visibleQuestionAliases);

  const l = useLocalizeField();

  useMarkEstimatorSeen();

  let showContinueToDetailsButton = false;

  const renderResult = () => {
    if (typ === "Miete") {
      const { best: bestZulaessigeHoechstmieteDiff } =
        useWorstBestZulaessigeHoechstmieteDiff();

      if (bestZulaessigeHoechstmieteDiff < 0) {
        return <ResultMieteZulaessig />;
      } else {
        showContinueToDetailsButton = true;
        return <ResultMieteNichtZulaessig />;
      }
    } else {
      const aktuelleNettokaltmiete = getAusgangsmiete(
        answers,
        visibleQuestionAliases,
      );
      const geforderteNettokaltmiete = getGeforderteNettokaltmiete(
        answers,
        visibleQuestionAliases,
      );
      const {
        best: bestZulaessigeHoechstmiete,
        worst: worstZulaessigeHoechstmiete,
      } = useWorstBestZulaessigeHoechstmiete();

      if (!aktuelleNettokaltmiete || !geforderteNettokaltmiete) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <h2 className="heading-24 mb-4">
              Fehler beim Berechnen des Ergebnisses
            </h2>
            <p className="text-neutral-faded mb-4">
              Es ist ein Fehler beim Berechnen des Ergebnisses aufgetreten.
              Bitte klick unten auf "Neu anfangen".
            </p>
          </div>
        );
      }

      if (geforderteNettokaltmiete < bestZulaessigeHoechstmiete) {
        /*
          Die geforderte Miete liegt unter der best-möglichsten zulässigen Höchstmiete.
          -> Die Mieterhöhung ist deswegen zulässig.

          Beispiel:
          - Aktuelle Miete: 400€
          - Geforderte Miete: 450€
          - zulässigeHöchstmiete: { best: 500, worst: 1000}
         */
        return <ResultMieterhöhungZulaessig />;
      } else if (geforderteNettokaltmiete < worstZulaessigeHoechstmiete) {
        /* 
          Die geforderte Miete liegt über der best-möglichsten zulässigen Höchstmiete, aber unter der schlecht-möglichsten zulässigen Höchstmiete.
          -> Die Mieterhöhung könnte deswegen in ihrer Höhe unzulässig sein.
          -> Der Fragebogen muss komplett ausgefüllt werden.

          Beispiel
          - Aktuelle Miete: 700€
          - Gefordert Miete: 750€
          - zulässigeHöchstmiete: { best: 500, worst: 1000}
        */
        showContinueToDetailsButton = true;
        return <ResultMieterhoehungPotentiellUnzulaessig />;
      } else {
        if (aktuelleNettokaltmiete < worstZulaessigeHoechstmiete) {
          /*
            Die geforderte Miete liegt über der schlecht-möglichsten zulässigen Höchstmiete.
            -> Die Mieterhöhung ist deswegen auf jeden Fall in ihrer Höhe unzulässig.
            
            Die aktuelle Miete liegt jedoch unter der schlecht-möglichsten zulässigen Höchstmiete.
            -> Die Miete könnte also bis zur schlecht-möglichsten zulässigen Höchstmiete erhöht werden.
            -> Der Fragebogen muss komplett ausgefüllt werden.

            Beispiel:
            - Aktuelle Miete: 900€
            - Gefordert Miete: 1100€
            - zulässigeHöchstmiete: { best: 500, worst: 1000}
          */
          showContinueToDetailsButton = true;
          return <ResultMieterhoehungPotentiellUnzulaessig />;
        } else {
          /*
            Die aktuelle und die geforderte Miete liegt beide über der schlecht-möglichsten zulässigen Höchstmiete.
            -> Die Mieterhöhung ist somit komplett unzulässig.

            Beispiel:
            - Aktuelle Miete: 1100€
            - Gefordert Miete: 1200€
            - zulässigeHöchstmiete: { best: 500, worst: 1000}
          */
          return <ResultMieterhoehungNichtZulaessig />;
        }
      }
    }
  };

  return (
    <>
      <p className="text-base text-neutral-faded mb-2">{l("Prediction")}</p>
      {renderResult()}

      <div className="flex flex-row flex-wrap justify-center gap-3 mt-10">
        {stepper.back && <Button onPress={stepper.back}>{l("Back")}</Button>}
        {showContinueToDetailsButton ? (
          <LinkButton
            color="primary"
            variant="solid"
            to={DetailsRouter.Summary()}
          >
            {l("go_to_details")}
          </LinkButton>
        ) : (
          <Button
            color="primary"
            variant="solid"
            onPress={() => {
              localStorage.clear();
              location.reload();
            }}
          >
            {l("restart")}
          </Button>
        )}
      </div>
    </>
  );
}
