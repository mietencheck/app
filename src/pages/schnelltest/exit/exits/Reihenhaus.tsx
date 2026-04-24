import Disclaimer from "../../partials/Disclaimer";

export function ExitReihenhaus() {
  return (
    <>
      <h2>
        Wir können die Höhe der Miete deiner Wohnung leider nicht bewertet.
      </h2>
      <p>
        Wir haben geprüft, ob die Höhe deiner Miete den gesetzlichen Vorgaben
        der Mietpreisbremse entspricht. Du hast angegeben, dass du in einem
        Einfamilienhaus, Zweifamilienhaus oder Reihenhaus wohnst.
      </p>
      <p>
        Die zulässige Miethöhe wird in Berlin üblicherweise anhand des Berliner
        Mietspiegels bestimmt. Dieser enthält jedoch keine Angaben für
        Einfamilienhäuser, Zweifamilienhäuser oder Reihenhäuser. Wir können die
        Miethöhe für deine Wohnung daher nicht bewerten.
      </p>
      <p>
        Wichtig: Das bedeutet nicht, dass die Mietpreisbremse in deinem Fall
        nicht gilt. Dein Fall ist lediglich etwas komplizierter.
      </p>
      <h3>Was nun?</h3>
      <p>
        Wir empfehlen dir, deinen konkreten Fall rechtlich prüfen zu lassen. Du
        findest <a href="[TODO]">hier</a> einen Artikel, wo du dies am besten
        tun kannst.
      </p>
      <Disclaimer />
    </>
  );
}
