import { getWorstBestAusstattungsAbzug } from "~/calculation/ausstattungsAbzug";
import {
  DialogBody,
  DialogHeader,
  DialogTitle,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "~/components";
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
      <div className="mb-8">
        <h2 className="heading-18 mb-4">{l("Deine Daten")}</h2>
        <DeineDatenTable />
      </div>

      <div className="mb-8">
        <div className="px-4 py-3 space-y-2 bg-gray-2 border-l-2 border-gray-6 text-gray-11 text-sm">
          <p>{l("Bester/Schlechtester Fall Erklärung Text 1")}</p>
          <p>
            <span className="text-sm text-gray-12">
              {l("Niedrigste Miete")}:
            </span>{" "}
            {l("Bester/Schlechtester Fall Erklärung Text 2")}
          </p>
          <p>
            <span className="text-sm text-gray-12">{l("Höchste Miete")}</span>{" "}
            {l("Bester/Schlechtester Fall Erklärung Text 3")}
          </p>
        </div>
      </div>

      {ausstattungsAbzug &&
        ausstattungsAbzug.worst != ausstattungsAbzug.best && (
          <div className="mb-8">
            <h2 className="heading-18 mb-4">{l("Ausstattungsabzug")}</h2>

            <AusstattungsAbzugTable />
          </div>
        )}

      <div className="mb-8">
        <h2 className="heading-18 mb-4">{l("Preisspanne")}</h2>

        <PreisspannenTable />
      </div>

      <div className="mb-8">
        <h2 className="heading-18 mb-4">{l("Merkmalsgruppen")}</h2>

        <SpanneneinordungTable />
      </div>

      <div className="mb-8">
        <h2 className="heading-18 mb-4">{l("Ortsübliche Vergleichsmiete")}</h2>

        <OrtsüblicheVergleichsmieteTable />
      </div>

      <div className="mb-8">
        <h2 className="heading-18 mb-4">{l("Zulässige Höchstmiete")}</h2>

        <ZulaessigeHoechstmieteTable />
      </div>
    </>
  );
}

export function AuswertungsDialog() {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();

  const mietspiegljahr = getMietspiegeljahr(answers);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{l("Auswertung")}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Tabs className="-mx-4 -mt-5">
          <TabList className="px-4 border-b border-gray-6 -mb-[1px] print:hidden">
            <Tab id="auswertung">{l("Details")}</Tab>
            <Tab id="merkmale">{l("Merkmale")}</Tab>
            {mietspiegljahr == "2015" && (
              <Tab id="sondermerkmale">{l("Sondermerkmale")}</Tab>
            )}
          </TabList>
          <TabPanel id="auswertung" className="px-4 py-6">
            <AuswertungTabPanel />
          </TabPanel>
          <TabPanel id="merkmale" className="px-4 py-6">
            <MerkmalTabPanel />
          </TabPanel>
          {mietspiegljahr == "2015" && (
            <TabPanel id="sondermerkmale" className="px-4 py-6">
              <SondermerkmalTabPanel />
            </TabPanel>
          )}
        </Tabs>
      </DialogBody>
    </>
  );
}
