import { Button, LinkButton } from "~/components/ui";
import { DetailsRouter } from "~/details/router";
import { useMieteDiff } from "~/details/utils";
import { useLocalizeField } from "~/l10n";

import { StepperType } from "..";
import { useMarkEstimatorSeen } from "../utils";
import { MieteZuHoch } from "./MieteZuHoch";
import { MieteZuNiedrig } from "./MieteZuNiedrig";

export function VorspeiseResult({ stepper }: { stepper: StepperType }) {
  const l = useLocalizeField();
  const { best: bestDiff } = useMieteDiff();

  useMarkEstimatorSeen();

  return (
    <>
      <p className="text-base text-neutral-faded mb-2">{l("Prediction")}</p>
      {bestDiff < 0 ? <MieteZuNiedrig /> : <MieteZuHoch />}

      <div className="flex flex-row flex-wrap justify-center gap-3 mt-10">
        {stepper.back && <Button onPress={stepper.back}>{l("Back")}</Button>}
        {bestDiff > 0 ? (
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
