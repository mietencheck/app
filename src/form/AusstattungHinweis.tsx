import { useAnswers } from "~/form/flow-machine";
import { useInlineLocale } from "~/l10n";

export function AusstattungHinweis() {
  const answers = useAnswers();
  const l = useInlineLocale();

  if (answers.getWithOptionAlias("Typ") !== "Miete") return null;

  return (
    <aside className="px-4 py-3 bg-yellow-2 border-l-2 border-yellow-6 text-yellow-11 space-y-2">
      <h2 className="font-medium">
        {l({ de: "Welche Ausstattung zählt?", en: "Which fittings count?" })}
      </h2>
      <p>
        {l({
          de: "Für alle Ausstattungsfragen zählt nur Ausstattung, die die Vermieterin oder der Vermieter bereitgestellt oder deren Kosten sie oder er dir erstattet hat. Das gilt auch für Bad, Heizung, Böden, Küche und Sondermerkmale.",
          en: "For every question about fittings in this questionnaire, count what the landlord provided or reimbursed you for. This also applies to bathrooms, heating, flooring, kitchens and special features.",
        })}
      </p>
      <p>
        {l({
          de: "Selbst eingebaute und bezahlte Ausstattung ohne Kostenerstattung bleibt unberücksichtigt. Beurteile die Ausstattung ohne diese eigenen Einbauten, auch bei Fragen nach fehlender Ausstattung. Beispiel: Eine selbst bezahlte Fußbodenheizung ohne Kostenerstattung zählt nicht als vorhandene Fußbodenheizung.",
          en: "Disregard fittings you installed and paid for without reimbursement. Assess the fittings without those additions, including questions about missing fittings. For example, underfloor heating you paid for without reimbursement does not count as existing underfloor heating.",
        })}
      </p>
      <p>
        {l({
          de: "Ist unklar, wer die Ausstattung bezahlt hat, oder wurden die Kosten nur teilweise erstattet? Wähle bei der betroffenen Frage „Ich bin mir nicht sicher“ und kläre den Fall in einer Mietberatung.",
          en: "Unsure who paid, or were the costs only partly reimbursed? Choose “I am not sure” for the affected question and clarify the situation with a tenancy adviser.",
        })}
      </p>
    </aside>
  );
}
