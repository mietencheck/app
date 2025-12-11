//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungOhneBegruendung() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        TODO: Die Mieterhöhung ist wahrscheinlich unrechtmäßig.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Vermieter sind gesetzlich verpflichtet die Mieterhöhung zu begründen.
          Insbesondere müssen sie bei Mieterhöhung aufgrund der ortsüblichen
          Vergleichsmiete auf den Mietenspiegel verweisen. Diese Begründung kann
          auch ganz kurz sein sollte aber zumindest eins der Wörter
          „Mietspiegel“ oder „Vergleichsmiete“ enthalten oder auf ein
          Tabellenfeld des Mietspiegels Bezug nehmen.
        </p>
        <p>
          Falls dies nicht der Fall ist, erfüllt die Mieterhöhung nicht den
          rechtlichen Vorraussetzungen und ist somit unrechtmäßig.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Hat dein Vermieter die Mieterhöhung nicht begründet hast du zwei
          Optionen:
        </p>
        <ol className="list-decimal list-outside pl-5 [&>li]:pl-1">
          <li>
            Du kannst deinen Vermieter um eine Begründung bitten.Wenn dein
            Vermieter die Begründung nachreicht, hast du immer noch mindestens
            einen Monat Zeit nachdem diese Begründung bei dir ankommt, um der
            Mieterhöhung zuzustimmen und deine Miete über diese Website zu
            überprüfen. Diese Frist kann der Vermieter dir nicht wegnehmen.
          </li>
          <li>
            Du kannst auf die Mieterhöhung nicht antworten. In diesem Falle kann
            es sein, dass dein Vermieter dich auf die Zustimmung zur
            Mieterhöhung verklagt. Der Vermieter hat dann die Option die
            Begründung der Mieterhöhung vor Gericht nachzuholen und wird dies
            wahrscheinlich auch tun. Dann hast du erneut mindestens einen Monat
            Zeit um der Mieterhöhung zuzustimmen und die Mieterhöhung über diese
            Website zu überprüfen. Wenn du der Mieterhöhung innerhalb der Frist
            zustimmst musst du auch nicht die Prozess- und Anwaltskosten tragen.
            Dieses Vorgehen ist stressiger, dafür musst du aber bis der
            Vermieter die Begründung nachholt, nur die alte Miete bezahlen.
          </li>
        </ol>
        <p>Wie du dich hier verhältst ist deine persönliche Entscheidung.</p>
      </div>
    </>
  );
}
