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
          de: "Berücksichtige nur Ausstattung, die der Vermieter gestellt oder deren Kosten er dir erstattet hat. Selbst bezahlte Ausstattung ohne Erstattung zählt nicht, zum Beispiel dein eigener Kühlschrank. Beantworte die Fragen so, als wäre diese Ausstattung nicht vorhanden.",
          en: "Count only fittings provided by the landlord or whose costs the landlord reimbursed you for. Fittings you paid for without reimbursement do not count, for example your own refrigerator. Answer the questions as if those fittings were not there.",
        })}
      </p>
      <p>
        {l({
          de: "Wenn unklar ist, wer die Ausstattung bezahlt hat, oder der Vermieter nur einen Teil erstattet hat, wähle bei der betroffenen Frage „Ich bin mir nicht sicher“.",
          en: "If it is unclear who paid for the fittings, or the landlord reimbursed only part of the cost, choose “I am not sure” for the affected question.",
        })}
      </p>
    </aside>
  );
}
