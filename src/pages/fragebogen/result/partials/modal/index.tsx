import { getWorstBestAusstattungsAbzug } from "~/calculation/ausstattungsAbzug";
import { IconButton, Tab, TabList, TabPanel, Tabs } from "~/components";
import { CloseIcon } from "~/components/Icons/Close";
import { getMietspiegeljahr } from "~/form/api";
import { answersToCalculationContext } from "~/form/calculation-context";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import { AusstattungsAbzugTable } from "./AusstattungsAbzug";
import { DeineDatenTable } from "./DeineDatenTable";
import { MerkmaleTable } from "./MerkmaleTable";
import { OrtsüblicheVergleichsmieteTable } from "./OrtsüblicheVergleichsmieteTable";
import { PreisspannenTable } from "./PreisspannenTable";
import { SondermerkmaleTable } from "./SondermerkmaleTable";
import { SpanneneinordungTable } from "./SpanneneinordnungTable";
import { ZulaessigeHoechstmieteTable } from "./ZulaessigeHoechstmieteTable";

export function SondermerkmalTabPanel() {
  return <SondermerkmaleTable />;
}
export function MerkmalTabPanel() {
  return <MerkmaleTable />;
}

export function AuswertungTabPanel() {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const ctx = answersToCalculationContext(answers, visibleQuestionAliases);
  const ausstattungsAbzug = ctx
    ? getWorstBestAusstattungsAbzug(ctx)
    : undefined;

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
              {l("Niedrigste Miete")}:
            </span>{" "}
            {l("Bester/Schlechtester Fall Erklärung Text 2")}
          </p>
          <p>
            <span className="text-sm-book text-gray-12">
              {l("Höchste Miete")}
            </span>{" "}
            {l("Bester/Schlechtester Fall Erklärung Text 3")}
          </p>
        </div>
      </div>

      {ausstattungsAbzug &&
        ausstattungsAbzug.worst != ausstattungsAbzug.best && (
          <div className="mb-12">
            <h2 className="heading-20 mb-6">{l("Ausstattungsabzug")}</h2>

            <AusstattungsAbzugTable />
          </div>
        )}

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Preisspanne")}</h2>

        <PreisspannenTable />
      </div>

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Merkmalsgruppen")}</h2>

        <SpanneneinordungTable />
      </div>

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Ortsübliche Vergleichsmiete")}</h2>

        <OrtsüblicheVergleichsmieteTable />
      </div>

      <div className="mb-12">
        <h2 className="heading-20 mb-6">{l("Zulässige Höchstmiete")}</h2>

        <ZulaessigeHoechstmieteTable />
      </div>
    </>
  );
}

export function AuswertungsModal({ onClose }: { onClose: () => void }) {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();

  const mietspiegljahr = getMietspiegeljahr(answers);

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
          <Tab id="auswertung">{l("Details")}</Tab>
          <Tab id="merkmale">{l("Merkmale")}</Tab>
          {mietspiegljahr == "2015" && (
            <Tab id="sondermerkmale">{l("Sondermerkmale")}</Tab>
          )}
        </TabList>
        <TabPanel id="auswertung" className="p-4 sm:p-6">
          <AuswertungTabPanel />
        </TabPanel>
        <TabPanel id="merkmale" className="p-4 sm:p-6">
          <MerkmalTabPanel />
        </TabPanel>
        {mietspiegljahr == "2015" && (
          <TabPanel id="sondermerkmale" className="p-4 sm:p-6">
            <SondermerkmalTabPanel />
          </TabPanel>
        )}
      </Tabs>
    </>
  );
}
