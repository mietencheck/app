import React from "react";

import { Button } from "~/components";
import { useAnswers } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import {
  ExitHaeuser,
  ExitKappungsgrenzeDurchAktuelleMieterhoehungUeberschritten,
  ExitKappungsgrenzeUeberschritten,
  ExitKeinWC,
  ExitMieterhoehungBetriebskosten,
  ExitMieterhoehungIndexmiete,
  ExitMieterhoehungIndexmieteBetriebskosten,
  ExitMieterhoehungIndexmieteModernisierung,
  ExitMieterhoehungIndexmieteUeberInflationsrate,
  ExitMieterhoehungIndexmieteWegenMietspiegel,
  ExitMieterhoehungKeineBegruendung,
  ExitMieterhoehungModernisierung,
  ExitMieterhoehungStaffelmiete,
  ExitMieterhoehungStaffelmieteBetriebskosten,
  ExitMieterhoehungStaffelmieteModernisierung,
  ExitMieterhoehungStaffelmieteUeberStaffel,
  ExitMieterhoehungStaffelmieteWegenMietspiegel,
  ExitMieterhoehungZugestimmt,
  ExitMietspiegeltabelleLeer,
  ExitMietvertragZuAlt,
  ExitMietvertragZuNeu,
  ExitMoebliert,
  ExitNeubauwohnung,
  ExitSozialwohnungen,
  ExitSperrfristenNichtEingehalten,
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

  /* Mieterhöhung */
  "Exit: Mieterhöhung ohne Begründung": () => (
    <ExitMieterhoehungKeineBegruendung />
  ),
  "Exit: Mieterhöhung wegen Modernisierung": () => (
    <ExitMieterhoehungModernisierung />
  ),
  "Exit: Mieterhöhung wegen Betriebskosten": () => (
    <ExitMieterhoehungBetriebskosten />
  ),
  "Exit: Sperrfristen nicht eingehalten": () => (
    <ExitSperrfristenNichtEingehalten />
  ),
  /* Mieterhöhung -> Indexmiete */
  "Exit: Mieterhöhung wegen Indexmiete rechtens": () => (
    <ExitMieterhoehungIndexmiete />
  ),
  "Exit: Mieterhöhung wegen Indexmiete über Inflationsrate hinaus": () => (
    <ExitMieterhoehungIndexmieteUeberInflationsrate />
  ),
  "Exit: Mieterhöhung wegen Mietspiegel bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteWegenMietspiegel />
  ),
  "Exit: Mieterhöhung wegen Modernisierung bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteModernisierung />
  ),
  /* Mieterhöhung -> Staffelmiete */
  "Exit: Mieterhöhung wegen Staffelmiete rechtens": () => (
    <ExitMieterhoehungStaffelmiete />
  ),
  "Exit: Mieterhöhung wegen Betriebskosten bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteBetriebskosten />
  ),
  "Exit: Mieterhöhung wegen Staffelmiete über Staffel hinaus": () => (
    <ExitMieterhoehungStaffelmieteUeberStaffel />
  ),
  "Exit: Mieterhöhung wegen Mietspiegel bei Staffelmiete": () => (
    <ExitMieterhoehungStaffelmieteWegenMietspiegel />
  ),
  "Exit: Mieterhöhung wegen Betriebskosten bei Staffelmiete": () => (
    <ExitMieterhoehungStaffelmieteBetriebskosten />
  ),
  "Exit: Mieterhöhung wegen Modernisierung bei Staffelmiete": () => (
    <ExitMieterhoehungStaffelmieteModernisierung />
  ),
  /* Mieterhöhung -> Kappungsgrenze */
  "Exit: Kappungsgrenze überschritten": () => (
    <ExitKappungsgrenzeUeberschritten />
  ),
  "Exit: Kappungsgrenze durch aktuelle Mieterhöhung überschritten": () => (
    <ExitKappungsgrenzeDurchAktuelleMieterhoehungUeberschritten />
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
      <p className="text-base text-neutral-faded mb-2">{l("Ergebnis")}</p>
      <div className="space-y-3 text-gray-11 [&_h2]:heading-24 [&_h2]:text-gray-12 [&_h2]:pb-3 [&_h3]:text-gray-12 [&_h3]:heading-16 [&_h3]:pt-3 [&_ol]:list-outside [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:ps-8 [&_li]:pl-1 [&_a]:underline">
        {step.alias in Exits
          ? React.createElement(Exits[step.alias as keyof typeof Exits], {
              state: answers.state as never,
            })
          : step.text}
      </div>
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
