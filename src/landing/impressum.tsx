import { Layout } from "./layout";

export function ImpressumPage() {
  return (
    <Layout>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-purple-11 text-center">
            <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
              Impressum
            </span>
          </h2>
          <div className="prose max-w-screen-sm mx-auto">
            <h2>Postanschrift</h2>
            <p>
              Initiative Deutsche Wohnen &amp; Co enteignen
              <br />
              c/o Stadtteilbüro Friedrichshain
              <br />
              Warschauer Str. 23, 10243 Berlin
            </p>

            <p>
              Diese Website ist das Ergebnis einer Zusammenarbeit zwischen
              Deutsche Wohnen und Co enteignen, Zoff Kollektiv (
              <a
                href="https://zoff-kollektiv.net"
                target="_blank"
                rel="noopener"
              >
                zoff-kollektiv.net
              </a>
              ) und codeRat (
              <a href="https://coderat.cc" target="_blank" rel="noopener">
                coderat.cc
              </a>
              ). Das Design der Website basiert auf dem von aufsiemitgebruell (
              <a
                href="https://aufsiemitgebruell.de"
                target="_blank"
                rel="noopener"
              >
                aufsiemitgebruell.de
              </a>
              ) entwickelten Corporate Design.
            </p>

            <h2>Pressekontakt</h2>
            <p>
              E-Mail:{" "}
              <a href="mailto:presse@dwenteignen.de">presse@dwenteignen.de</a>
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
