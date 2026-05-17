import { Layout } from "~/pages/layout";

export function ImpressumPage() {
  return (
    <Layout>
      <section className="bg-pink-9 py-20 sm:py-24">
        <div className="container">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-center text-white">
            Impressum
          </h2>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20">
          <div className="prose max-w-screen-sm mx-auto">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              Mieten Law Clinic Berlin e.V.
              <br />
              c/o Fachbereich Rechtswissenschaften
              <br />
              Sekretariat Univ-Prof. Dr. Rödl
              <br />
              Van&apos;t-Hoff-Str. 8
              <br />
              14195 Berlin
            </p>

            <h2>Kontakt</h2>
            <p>
              E-Mail:{" "}
              <a href="mailto:kontakt@mietenlawclinic.de">
                kontakt@mietenlawclinic.de
              </a>
            </p>

            <h2>Vertreten durch</h2>
            <p>
              Selma Gather (Co-Vorsitzende)
              <br />
              Melvin Thomas (Co-Vorsitzende)
              <br />
              Lea Reinholz (Co-Vorsitzende)
              <br />
              Dörte Kleideiter (Schatzmeisterin)
            </p>

            <h2>Registereintrag</h2>
            <p>
              Eintragung im Vereinsregister.
              <br />
              Registergericht: Amtsgericht Berlin-Charlottenburg
              <br />
              Registernummer: VR 42370 B
            </p>

            <h2>Haftung für Inhalte</h2>
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter
              sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG
              sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen
              oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung
              der Nutzung von Informationen nach den allgemeinen Gesetzen
              bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
              erst ab dem Zeitpunkt der Kenntnis einer konkreten
              Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>

            <h2>Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle
              der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
              Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>

            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
              Seite nicht vom Betreiber erstellt wurden, werden die
              Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
              Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
              werden wir derartige Inhalte umgehend entfernen.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
