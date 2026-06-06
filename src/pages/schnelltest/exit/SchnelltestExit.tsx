import React from "react";

import { Button } from "~/components";
import { useAnswers } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import {
  ExitIndexmietvertragVorherigeMieterhoehungAndererGrund,
  ExitIndexmietvertragVorherigeMieterhoehungFreiwillig,
  ExitKappungsgrenzeDurchAktuelleMieterhoehungUeberschritten,
  ExitKappungsgrenzeUeberschritten,
  ExitKeineWohnlageGefunden,
  ExitMieterhoehungBetriebskosten,
  ExitMieterhoehungFreiwillig,
  ExitMieterhoehungIndexmieteAndereBegruendung,
  ExitMieterhoehungIndexmieteBetriebskosten,
  ExitMieterhoehungIndexmieteFreiwillig,
  ExitMieterhoehungIndexmieteModernisierung,
  ExitMieterhoehungIndexmieteStaffelmiete,
  ExitMieterhoehungIndexmieteUeberInflationsrate,
  ExitMieterhoehungIndexmieteUnterInflationsrate,
  ExitMieterhoehungIndexmieteWegenMietspiegel,
  ExitMieterhoehungModernisierung,
  ExitMieterhoehungOhneBegruendung,
  ExitMieterhoehungStaffelmiete,
  ExitMieterhoehungStaffelmieteUeberStaffel,
  ExitMieterhoehungStaffelmietvertragAndereBegruendung,
  ExitMieterhoehungStaffelmietvertragBetriebskosten,
  ExitMieterhoehungStaffelmietvertragFreiwillig,
  ExitMieterhoehungStaffelmietvertragIndexmiete,
  ExitMieterhoehungStaffelmietvertragMietspiegel,
  ExitMieterhoehungStaffelmietvertragModernisierung,
  ExitMieterhoehungZugestimmt,
  ExitMietspiegelFeldLeer,
  ExitMietvertragVorherigeMieterhoehungAndererGrund,
  ExitMietvertragZuAlt,
  ExitMoeblierteWohnung,
  ExitNeubauwohnung,
  ExitReihenhaus,
  ExitSozialwohnung,
  ExitSperrfristenNichtEingehalten,
  ExitStaffelmietvertragVorherigeMieterhoehungAndererGrund,
  ExitStaffelmietvertragVorherigeMieterhoehungFreiwillig,
  ExitWohnungOhneWC,
} from ".";
import { StepperType } from "..";
import { ExitMietvertragVorherigeMieterhoehungFreiwillig } from "./exits/miete/mietvertrag/VorherigeMieterhoehungFreiwillig";

const Exits = {
  "Exit: Mietvertrag zu alt": () => <ExitMietvertragZuAlt />,
  "Exit: Keine Wohnlage gefunden": () => <ExitKeineWohnlageGefunden />,
  "Exit: Mietspiegel Feld Leer": () => <ExitMietspiegelFeldLeer />,
  "Exit: Neubauwohnung": () => <ExitNeubauwohnung />,
  "Exit: Sozialwohnung": () => <ExitSozialwohnung />,
  "Exit: Ein-/Zweifamilienhäuser oder Reihenhäuser": () => <ExitReihenhaus />,
  "Exit: Wohnung ohne WC": () => <ExitWohnungOhneWC />,
  "Exit: Möblierte Wohnung": () => <ExitMoeblierteWohnung />,
  "Exit: Mieterhöhung zugestimmt": () => <ExitMieterhoehungZugestimmt />,

  /* Miete */
  "Exit: Vorherige Mieterhöhung (Freiwillig)": () => (
    <ExitMietvertragVorherigeMieterhoehungFreiwillig />
  ),
  "Exit: Vorherige Mieterhöhung (Anderer Grund)": () => (
    <ExitMietvertragVorherigeMieterhoehungAndererGrund />
  ),
  "Exit: Vorherige Mieterhöhung bei Staffelmiete (Freiwillig)": () => (
    <ExitStaffelmietvertragVorherigeMieterhoehungFreiwillig />
  ),
  "Exit: Vorherige Mieterhöhung bei Staffelmiete (Anderer Grund)": () => (
    <ExitStaffelmietvertragVorherigeMieterhoehungAndererGrund />
  ),
  "Exit: Vorherige Mieterhöhung bei Indexmiete (Freiwillig)": () => (
    <ExitIndexmietvertragVorherigeMieterhoehungFreiwillig />
  ),
  "Exit: Vorherige Mieterhöhung bei Indexmiete (Anderer Grund)": () => (
    <ExitIndexmietvertragVorherigeMieterhoehungAndererGrund />
  ),

  /* Mieterhöhung */
  "Exit: Sperrfristen nicht eingehalten": () => (
    <ExitSperrfristenNichtEingehalten />
  ),
  "Exit: Mieterhöhung wegen Modernisierung": () => (
    <ExitMieterhoehungModernisierung />
  ),
  "Exit: Mieterhöhung wegen Betriebskosten": () => (
    <ExitMieterhoehungBetriebskosten />
  ),
  "Exit: Mieterhöhung andere Begründung": () => (
    <ExitMieterhoehungOhneBegruendung />
  ),
  "Exit: Freiwillige Mieterhöhung": () => <ExitMieterhoehungFreiwillig />,
  /* Mieterhöhung -> Indexmiete */
  "Exit: Mieterhöhung wegen Mietspiegel bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteWegenMietspiegel />
  ),
  "Exit: Mieterhöhung wegen Indexmiete rechtens": () => (
    <ExitMieterhoehungIndexmieteUnterInflationsrate />
  ),
  "Exit: Mieterhöhung wegen Indexmiete über Inflationsrate hinaus": () => (
    <ExitMieterhoehungIndexmieteUeberInflationsrate />
  ),
  "Exit: Staffelmieterhöhung bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteStaffelmiete />
  ),
  "Exit: Mieterhöhung wegen Modernisierung bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteModernisierung />
  ),
  "Exit: Mieterhöhung wegen Betriebskosten bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteBetriebskosten />
  ),
  "Exit: Freiwillige Mieterhöhung bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteFreiwillig />
  ),
  "Exit: Mieterhöhung andere Begründung bei Indexmiete": () => (
    <ExitMieterhoehungIndexmieteAndereBegruendung />
  ),
  /* Mieterhöhung -> Staffelmiete */
  "Exit: Mieterhöhung wegen Staffelmiete rechtens": () => (
    <ExitMieterhoehungStaffelmiete />
  ),
  "Exit: Mieterhöhung wegen Staffelmiete über Staffel hinaus": () => (
    <ExitMieterhoehungStaffelmieteUeberStaffel />
  ),
  "Exit: Mieterhöhung wegen Mietspiegel bei Staffelmietvertrag": () => (
    <ExitMieterhoehungStaffelmietvertragMietspiegel />
  ),
  "Exit: Mieterhöhung wegen Indexmiete bei Staffelmietvertrag": () => (
    <ExitMieterhoehungStaffelmietvertragIndexmiete />
  ),
  "Exit: Mieterhöhung wegen Modernisierung bei Staffelmietvertrag": () => (
    <ExitMieterhoehungStaffelmietvertragModernisierung />
  ),
  "Exit: Mieterhöhung wegen Betriebskosten bei Staffelmietvertrag": () => (
    <ExitMieterhoehungStaffelmietvertragBetriebskosten />
  ),
  "Exit: Freiwillige Mieterhöhung bei Staffelmiete": () => (
    <ExitMieterhoehungStaffelmietvertragFreiwillig />
  ),
  "Exit: Mieterhöhung andere Begründung bei Staffelmiete": () => (
    <ExitMieterhoehungStaffelmietvertragAndereBegruendung />
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
      <p className="text-base text-gray-11 mb-2">{l("Ergebnis")}</p>
      <div className="space-y-3 text-gray-11 [&_h2]:heading-22 [&_h2]:text-gray-12 [&_h2]:pb-2 [&_h3]:text-gray-12 [&_h3]:heading-16 [&_h3]:pt-3 [&_ol]:list-outside [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:ps-8 [&_li]:pl-1 [&_a]:underline">
        {step.alias in Exits
          ? React.createElement(Exits[step.alias as keyof typeof Exits], {
              state: answers.state as never,
            })
          : step.text}
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-3 mt-10">
        {stepper.back && (
          <Button
            variant="outline"
            color="gray"
            type="button"
            onClick={stepper.back}
          >
            {l("Back")}
          </Button>
        )}
        <Button
          variant="solid"
          type="button"
          onClick={() => {
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
