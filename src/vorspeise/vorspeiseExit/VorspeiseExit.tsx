import React from "react";

import { Button } from "~/components";
import { useAnswers } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import {
  ExitHäuser,
  ExitKeinWC,
  ExitMöbliert,
  ExitSozialwohnungen,
  MietspiegeltabelleLeer,
  MietvertragZuAlt,
  MietvertragZuNeu,
  Neubauwohnung,
} from ".";
import { StepperType } from "..";

const Exits = {
  "Mietvertrag zu alt": () => <MietvertragZuAlt />,
  Mietspiegel2024: () => <MietvertragZuNeu />,
  "Mietspiegeltabelle Leer": () => <MietspiegeltabelleLeer />,
  "Zu neu": () => <Neubauwohnung />,
  "Mietpreisbremse gilt nicht für Sozialwohnungen": () => (
    <ExitSozialwohnungen />
  ),
  "Mietspiegel gilt nicht für Ein-/Zweifamilienhäuser oder Reihenhäuser":
    () => <ExitHäuser />,
  "Mietspiegel gilt nicht für Wohnungen ohne WC": () => <ExitKeinWC />,
  "Möblierte Wohnung": () => <ExitMöbliert />,
};

export function VorspeiseExit({
  step,
  stepper,
}: {
  step: any;
  stepper: StepperType;
}) {
  const answers = useAnswers();
  const l = useLocalizeField();

  return (
    <>
      <h2 className="text-base text-neutral-faded mb-2">{l("Ergebnis")}</h2>
      {step.alias in Exits
        ? React.createElement(Exits[step.alias as keyof typeof Exits], {
            state: answers.state as never,
          })
        : step.text}
      <div className="flex flex-row flex-wrap justify-center gap-3 mt-10">
        {stepper.back && <Button onPress={stepper.back}>{l("Back")}</Button>}
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
      </div>
    </>
  );
}
