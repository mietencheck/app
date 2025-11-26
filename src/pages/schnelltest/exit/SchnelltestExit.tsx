import React from "react";

import { Button } from "~/components";
import { useAnswers } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import {
  ExitHaeuser,
  ExitKeinWC,
  ExitMieterhoehungFreiwillig,
  ExitMieterhoehungIndexmiete,
  ExitMieterhoehungModernisierung,
  ExitMieterhoehungOhneBegruendung,
  ExitMieterhoehungStaffelmiete,
  ExitMieterhoehungZugestimmt,
  ExitMieterhoehungZusaetzlichZurIndexmiete,
  ExitMieterhoehungZusaetzlichZurStaffelmiete,
  ExitMietspiegeltabelleLeer,
  ExitMietvertragZuAlt,
  ExitMietvertragZuNeu,
  ExitMoebliert,
  ExitNeubauwohnung,
  ExitSozialwohnungen,
} from ".";
import { StepperType } from "..";

const Exits = {
  Mietspiegel2024: () => <ExitMietvertragZuNeu />,
  "Exit: Mietvertrag zu alt": () => <ExitMietvertragZuAlt />,
  "Exit: Mietspiegeltabelle Leer": () => <ExitMietspiegeltabelleLeer />,
  "Exit: Zu neu": () => <ExitNeubauwohnung />,
  "Exit: Mietpreisbremse gilt nicht für Sozialwohnungen": () => (
    <ExitSozialwohnungen />
  ),
  "Exit: Mietspiegel gilt nicht für Ein-/Zweifamilienhäuser oder Reihenhäuser":
    () => <ExitHaeuser />,
  "Exit: Mietspiegel gilt nicht für Wohnungen ohne WC": () => <ExitKeinWC />,
  "Exit: Möblierte Wohnung": () => <ExitMoebliert />,
  "Exit: Mieterhöhung zugestimmt": () => <ExitMieterhoehungZugestimmt />,
  "Exit: Mieterhöhung freiwillig": () => <ExitMieterhoehungFreiwillig />,
  "Exit: Mieterhöhung Modernisierung": () => (
    <ExitMieterhoehungModernisierung />
  ),
  "Exit: Mieterhöhung ohne Begründung": () => (
    <ExitMieterhoehungOhneBegruendung />
  ),
  "Exit: Mieterhöhung wegen Indexmiete": () => <ExitMieterhoehungIndexmiete />,
  "Exit: Mieterhöhung zusätzlich zur Indexmiete": () => (
    <ExitMieterhoehungZusaetzlichZurIndexmiete />
  ),
  "Exit: Mieterhöhung wegen Staffelmiete": () => (
    <ExitMieterhoehungStaffelmiete />
  ),
  "Exit: Mieterhöhung zusätzlich zur Staffelmiete": () => (
    <ExitMieterhoehungZusaetzlichZurStaffelmiete />
  ),
};

export function SchnelltestExit({
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
