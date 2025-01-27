import { getMietspiegeljahr } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import { WerdeAktiv } from "../../partials";

export function Neubauwohnung() {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);

  return (
    <>
      <h2 className="heading-24 mb-6">{l("Exit Neubauwohnung Titel")}</h2>
      <div className="space-y-2 mb-6 text-neutral-faded">
        {mietspiegeljahr == "2015" ? (
          <p>{l("Exit Neubauwohnung Text 1 Mietspiegel 2015")}</p>
        ) : (
          <p>{l("Exit Neubauwohnung Text 1")}</p>
        )}
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">{l("Was nun?")}</h3>
        <p>{l("Was nun? Text")}</p>
      </div>
      <WerdeAktiv />
    </>
  );
}
