import { IconButton, Tab, TabList, TabPanel, Tabs } from "~/components/ui";
import { CloseIcon } from "~/components/ui/Icons/Close";
import { getMietspiegelJahr, useAnswers } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import { DeineDatenTable } from "./DeineDatenTable";
import { HöchstmieteTable } from "./HöchstmieteTable";
import { MerkmaleTable } from "./MerkmaleTable";
import { MerkmalsGruppenTable } from "./MerkmalsGruppenTable";
import { OrtsüblicheVergleichsmieteTable } from "./OrtsüblicheVergleichsmieteTable";
import { SondermerkmaleTable } from "./SondermerkmaleTable";
import { SpanneneinordnungTable } from "./SpanneneinordnungTable";

export function MerkmalTabPanel() {
  return <MerkmaleTable />;
}

export function AuswertungTabPanel() {
  const answers = useAnswers();
  const jahr = getMietspiegelJahr(answers.getWithOptionAlias("Vertragsdatum"));
  const l = useLocalizeField();

  return (
    <>
      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Deine Daten")}</h2>

        <DeineDatenTable />
      </div>

      <div className="mb-12">
        <div className="px-4 py-3 space-y-2 bg-gray-2 border-l-2 border-gray-6 text-gray-11 text-sm">
          <p>{l("Bester/Schlechtester Fall Erklärung Text 1")}</p>
          <p>
            <span className="text-sm-book text-gray-12">
              {l("Bester Fall")}:
            </span>{" "}
            {l("Bester/Schlechtester Fall Erklärung Text 2")}
          </p>
          <p>
            <span className="text-sm-book text-gray-12">
              {l("Schlechtester Fall")}
            </span>{" "}
            {l("Bester/Schlechtester Fall Erklärung Text 3")}
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Spanneneinordnung")}</h2>

        <SpanneneinordnungTable />
      </div>

      {jahr == "2015" && (
        <div className="mb-12">
          <h2 className="heading-20 mb-6">{l("Sondermerkmale")}</h2>

          <SondermerkmaleTable />
        </div>
      )}

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Merkmalsgruppen")}</h2>

        <MerkmalsGruppenTable />
      </div>

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Ortsübliche Vergleichsmiete")}</h2>

        <OrtsüblicheVergleichsmieteTable />
      </div>

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Zulässige Höchstmiete")}</h2>

        <HöchstmieteTable />
      </div>
    </>
  );
}

export function AuswertungsModal({ onClose }: { onClose: () => void }) {
  const l = useLocalizeField();
  return (
    <>
      <header className="sticky top-0 px-4 sm:px-6 py-3 flex flex-row justify-between items-center bg-white border-b z-10 print:hidden">
        <h2 className="heading-16">{l("Auswertung")}</h2>
        <IconButton size="sm" variant="ghost" onPress={onClose}>
          <CloseIcon />
        </IconButton>
      </header>
      <Tabs>
        <TabList className="px-4 sm:px-6 border-b border-neutral-subtle -mb-[1px] print:hidden">
          <Tab id="evaluation">{l("Details")}</Tab>
          <Tab id="details">{l("Merkmale")}</Tab>
        </TabList>
        <TabPanel id="evaluation" className="p-4 sm:p-6">
          <AuswertungTabPanel />
        </TabPanel>
        <TabPanel id="details" className="p-4 sm:p-6">
          <MerkmalTabPanel />
        </TabPanel>
      </Tabs>
    </>
  );
}
