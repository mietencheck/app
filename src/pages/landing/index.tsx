import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components";
import { Link } from "~/components/Link/Link";
import { useInlineLocale } from "~/l10n";
import { Layout } from "~/pages/layout";

export default function LandingPage() {
  const l = useInlineLocale();

  return (
    <Layout>
      <section className="bg-purple-9 bg-[url('/images/hero-pattern.svg')] bg-[length:auto_100%] bg-repeat-x bg-center">
        <div className="container sm:grid sm:grid-cols-12 gap-12 py-24 text-center">
          <div className="sm:col-span-12 xl:col-start-3 xl:col-span-8">
            <h1 className="title-48 sm:title-56 md:title-60 lg:title-64 text-white mb-8">
              {l({
                de: "Wir setzen dein Recht auf faire Mieten durch!",
                en: "We stand up for your right to fair rent!",
              })}
            </h1>
            <p className="text-xl text-white mb-16">
              {l({
                de: "Überprüfe jetzt, ob deine Miete oder die bevorstehende Mieterhöhung rechtmäßig ist. Erhalte eine erste Einschätzung in weniger als 5 Minuten.",
                en: "Check now whether your rent or an upcoming rent increase is legal. Get an initial assessment in less than 5 minutes.",
              })}
            </p>
            <Link
              href="/schnelltest"
              size={"lg"}
              color={"red"}
              variant={"solid"}
              className="text-lg"
            >
              {l({
                de: "Jetzt Miete checken",
                en: "Check your rent now",
              })}
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-blue-8">
        <div className="container py-8 flex gap-10 items-center justify-center">
          <p className="text-base-medium text-white">
            {l({ de: "Ein Projekt der", en: "A project of" })}
          </p>
          <a
            href="https://www.jura.fu-berlin.de/fachbereich/einrichtungen/zivilrecht/lehrende/roedlf/Mieten-Law-Clinic/index.html"
            target="_blank"
          >
            <img
              src="/images/milc-logo.svg"
              className="h-[40px]"
              alt="Mieten Law Clinic e.V."
            />
          </a>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-center">
            {l({ de: "Check jetzt deine Miete!", en: "Check your rent now" })}{" "}
            <br className="hidden sm:block" />{" "}
            {l({ de: "Kostenlos und sicher.", en: "Free and secure." })}
          </h2>
          <div className="flex flex-col sm:flex-row gap-10">
            <div className="p-6 sm:p-8 bg-purple-3">
              <h3 className="title-24 lg:title-28 mb-3">
                {l({ de: "Miete überprüfen", en: "Check your rent" })}
              </h3>
              <p className="text-lg mb-6 text-gray-11">
                {l({
                  de: "Finde heraus, ob du für deine aktuelle oder neue Wohnung zu viel Miete zahlst.",
                  en: "Find out if you are paying too much rent for your current or new apartment.",
                })}
              </p>
              <Link color="purple" variant="solid" href="/schnelltest">
                {l({ de: "Jetzt checken", en: "Take the test" })}
              </Link>
            </div>
            <div className="p-6 sm:p-8 bg-purple-3">
              <h3 className="title-24 lg:title-28 mb-3">
                {l({
                  de: "Mieterhöhung überprüfen",
                  en: "Check rent increase",
                })}
              </h3>
              <p className="text-lg mb-6 text-gray-11">
                {l({
                  de: "Hast du eine Mieterhöhung bekommen? Finde heraus, ob die Erhöhung rechtens ist.",
                  en: "Have you received a rent increase? Find out if the increase is legal.",
                })}
              </p>
              <Link color="purple" variant="solid" href="/schnelltest" disabled>
                {l({ de: "Bald verfügbar", en: "Coming soon" })}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-gray-12 text-center">
            {l({ de: "So funktioniert's", en: "How it works" })}
          </h2>

          <div className="mx-auto max-w-screen-lg space-y-16 sm:space-y-12">
            {[
              {
                imageDe: "images/landing/so-funktionierts-01.jpg",
                imageEn: "images/landing/so-funktionierts-01-en.jpg",
                alt: {
                  de: "Screenshot einer Prognose",
                  en: "Screenshot of a prediction",
                },
                number: "1",
                title: {
                  de: "Mach den Schnell-Test",
                  en: "Take the quick test",
                },
                description: {
                  de: "Finde in 5 Minuten heraus, ob du die Miete für deine aktuelle oder neue Wohnung potentiell höher als erlaubt ist.",
                  en: "Find out in 5 minutes whether the rent for your current or new apartment is potentially higher than allowed.",
                },
              },
              {
                imageDe: "images/landing/so-funktionierts-02.jpg",
                imageEn: "images/landing/so-funktionierts-02-en.jpg",
                alt: {
                  de: "Screenshot einer Frage",
                  en: "Screenshot of a question",
                },
                number: "2",
                title: {
                  de: "Ermittle die zulässige Höchstmiete für deine Wohnung",
                  en: "Determine the maximum permissible rent for your apartment",
                },
                description: {
                  de: "Fülle unseren Fragebogen aus und finde ganz einfach heraus, wie hoch die Miete für deine Wohnung maximal sein darf.",
                  en: "Fill out our questionnaire and easily find out how high the maximum rent for your apartment can be.",
                },
              },
              {
                imageDe: "images/landing/so-funktionierts-03.jpg",
                imageEn: "images/landing/so-funktionierts-03-en.jpg",
                alt: {
                  de: "Screenshot eines Resultates",
                  en: "Screenshot of a result",
                },
                number: "3",
                title: {
                  de: "Setze dein Recht auf eine günstigere Miete durch",
                  en: "Enforce your right to a cheaper rent",
                },
                description: {
                  de: "Wir zeigen dir deine Möglichkeiten, wie du dein Recht auf eine günstigere Miete am besten durchsetzen kannst.",
                  en: "We will show you your options for how you can best enforce your right to a cheaper rent.",
                },
              },
            ].map((item) => (
              <div
                key={item.number}
                className="flex flex-col gap-6 md:flex-row md:gap-10"
              >
                <div className="w-full lg:pr-4">
                  <img
                    src={l({ de: item.imageDe, en: item.imageEn })}
                    alt={l(item.alt)}
                  />
                </div>
                <div className="w-full flex flex-col justify-center text-purple-11">
                  <div className="flex items-center justify-center h-6 w-6 mb-4 bg-purple-9 text-white text-lg-medium text-center rounded-full">
                    <span className="w-6 text-center">{item.number}</span>
                  </div>
                  <h3 className="title-24 mb-2 text-gray-12">
                    {l(item.title)}
                  </h3>
                  <p className="text-lg text-gray-11">{l(item.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="flex flex-col items-center gap-y-2 title-36 sm:title-40 md:title-44 lg:title-48 text-center">
            {l({
              de: "Häufig gestellte Fragen",
              en: "Frequently asked questions",
            })}
          </h2>

          <div className="flex flex-col gap-10 md:flex-row">
            <div className="w-full">
              <h3 className="title-28 md:title-32 mb-8">
                {l({ de: "Mietpreisbremse", en: "Rent Control Act" })}
              </h3>
              <Accordion type="single" collapsible className="gap-4">
                {[
                  {
                    question: {
                      de: "Was ist die Mietpreisbremse?",
                      en: "What is the Rent Control Act?",
                    },
                    answer: {
                      de: (
                        <p>
                          Die Mietpreisbremse ist ein Gesetz, das den rasanten
                          Anstieg der Mietpreise bremsen soll. Die
                          Mietpreisbremse soll einerseits verhindern, dass neue
                          Mietverträge mit zu hohen Mietpreisen abgeschlossen
                          werden und andererseits ermöglichen, dass zu hohe
                          Mieten gesenkt werden.
                        </p>
                      ),
                      en: (
                        <p>
                          The Rent Control Act is a law designed to slow down
                          the rapid rise in rents. On the one hand, the rent
                          freeze is intended to prevent new rental agreements
                          being concluded with excessively high rents and, on
                          the other, to enable excessively high rents to be
                          reduced.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Was bringt die Mietpreisbremse?",
                      en: "What are the benefits of the Rent Control Act?",
                    },
                    answer: {
                      de: (
                        <p>
                          Ziehst Du erfolgreich die Mietpreisbremse, musst Du
                          zukünftig deutlich weniger Miete bezahlen und kannst
                          die zu viel bezahlte Miete zurückverlangen. Außerdem
                          gilt: Wenn viele Menschen erfolgreich ihre Miete
                          senken, wird auch der Mietspiegel niedrig gehalten.
                          Das ist wichtig, weil der Mietspiegel der Maßstab für
                          die zulässigen Miethöhen ist.
                        </p>
                      ),
                      en: (
                        <p>
                          If you successfully apply the rent freeze, you will
                          have to pay significantly less rent in future and can
                          reclaim the rent you have paid in excess. In addition,
                          if many people successfully reduce their rent, the
                          rent index will also be kept low. This is important
                          because the rent index is the benchmark for
                          permissible rent levels.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Gilt die Mietpreisbremse in ganz Berlin?",
                      en: "Does the Rent Control apply throughout Berlin?",
                    },
                    answer: {
                      de: (
                        <p>
                          Die Mietpreisbremse gilt seit 2015 in ganz Berlin,
                          denn die Mieten steigen überall sehr schnell und
                          bezahlbarer Wohnraum ist kaum zu finden. Alle
                          gesetzlichen Kriterien zur Bestimmung eines
                          „angespannten Wohnungsmarktes“ sind in ganz Berlin
                          erfüllt.
                        </p>
                      ),
                      en: (
                        <p>
                          The Rent Control Act has been applied throughout
                          Berlin since 2015, because rents are rising very
                          quickly everywhere and affordable housing is hard to
                          find. All legal criteria for determining a “tight
                          housing market” are met throughout Berlin.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Gilt die Mietpreisbremse für alle Wohnungen?",
                      en: "Does the Rent Control apply to all apartments?",
                    },
                    answer: {
                      de: (
                        <p>
                          Leider nein, es gibt ein paar Ausnahmen. Ob du die
                          Mietpreisbremse ziehen kannst, findest du mit unserem
                          Rechner heraus!
                        </p>
                      ),
                      en: (
                        <p>
                          Unfortunately no, there are a few exceptions. Use our
                          calculator to find out whether you can apply the Rent
                          Control!
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Wie hoch darf die zulässige Miete sein?",
                      en: "How high can the permitted rent be?",
                    },
                    answer: {
                      de: (
                        <p>
                          Die zulässige Miete richtet sich nach der ortsüblichen
                          Vergleichsmiete. Diese wird in Berlin in der Regel
                          nach dem Mietspiegel bestimmt. Zudem gibt es weitere
                          Faktoren, die die zulässige Miethöhe beeinflussen
                          können. Insbesondere durchgeführte
                          Modernisierungsmaßnahmen können die zulässige Miete
                          erhöhen.
                        </p>
                      ),
                      en: (
                        <p>
                          The permissible rent is based on the local comparative
                          rent. In Berlin, this is usually determined according
                          to the rent index. There are also other factors that
                          can influence the permissible rent. In particular,
                          modernization measures carried out can increase the
                          permissible rent.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Was ist der Mietspiegel?",
                      en: "What is the rent index?",
                    },
                    answer: {
                      de: (
                        <p>
                          Der Mietspiegel weist aus, wie hoch die Miete in den
                          unterschiedlichen Berliner Gegenden sein darf. Um das
                          festzulegen orientiert er sich an dem Durchschnitt der
                          schon bestehenden Mieten in den jeweiligen Gegenden.
                        </p>
                      ),
                      en: (
                        <p>
                          The rent index shows how high the rent may be in the
                          different areas of Berlin. To determine this, it is
                          based on the average of existing rents in the
                          respective areas.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Was mache ich, wenn meine Miete zu hoch ist?",
                      en: "What do I do if my rent is too high?",
                    },
                    answer: {
                      de: (
                        <p>
                          Mieter*innen müssen einen Verstoß gegen die
                          Mietpreisbremse rügen. Hierzu solltest Du Deinem*
                          Vermieter*in schriftlich die ermittelte zulässige
                          Miethöhe mitteilen. Dein*e Vermieter*in muss dir die
                          Auskünfte geben, die für die Prüfung der zulässigen
                          Miethöhe benötigt werden, wenn du ihn*sie dazu
                          aufforderst. Ausführliche Informationen zu Deinen
                          Handlungsoptionen findest du in unserem Ratgeber.
                        </p>
                      ),
                      en: (
                        <p>
                          Tenants must report a violation of the rent freeze. To
                          do this, you should inform your landlord in writing of
                          the determined permissible rent level. Your landlord
                          must provide you with the information required to
                          check the permissible rent level if you ask him/her to
                          do so. You can find detailed information in our guide.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Kann ich nach der Rüge einfach weniger Miete bezahlten?",
                      en: "Can I simply pay less rent after the complaint?",
                    },
                    answer: {
                      de: (
                        <p>
                          Nein, das solltest Du auf keinen Fall tun! Es ist
                          nicht auszuschließen, dass Du Dich bei der Berechnung
                          der zulässigen Miete geirrt hast oder ein Gericht zu
                          einer unvorhersehbaren Rechtsauffassung gelangt. In
                          diesem Fall könntest Du schnell in einen
                          Zahlungsverzug kommen. Dieser kann im schlimmsten Fall
                          zu einer Kündigung durch Deine*n Vermieter*in führen.
                        </p>
                      ),
                      en: (
                        <p>
                          No, you should never do that! It cannot be ruled out
                          that you have made a mistake in calculating the
                          permissible rent or that a court has come to an
                          unforeseeable legal conclusion. In this case, you
                          could quickly fall into arrears. In the worst case
                          scenario, this could lead to your landlord giving you
                          notice to quit.
                        </p>
                      ),
                    },
                  },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`mpb-${i}`}>
                    <AccordionTrigger className="text-left heading-20 [&>svg]:text-gray-11 [&>svg]:h-7 [&>svg]:w-7">
                      {l(item.question)}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2 pl-[38px] text-gray-11 text-lg">
                      {l(item.answer)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="w-full">
              <h3 className="title-28 md:title-32 mb-8">
                {l({ de: "Mieten Law Clinic", en: "Mieten Law Clinic" })}
              </h3>
              <Accordion type="single" collapsible className="gap-4">
                {[
                  {
                    question: {
                      de: "Was ist die Mieten Law Clinic?",
                      en: "What is the Mieten Law Clinic?",
                    },
                    answer: {
                      de: (
                        <>
                          <p>
                            Die Mieten Law Clinic Berlin e. V. ist eine
                            Initiative von Personen, die rechtswissenschaftlich
                            o. praktisch im Mietrecht aktiv sind. Wir haben uns
                            zusammengeschlossen und die Mieten Law Clinic Berlin
                            gegründet, um Studierenden das Mietrecht näher zu
                            bringen und um Berliner Mietenden dabei zu helfen,
                            ihre Mieten zu legalisieren.
                          </p>
                          <p>
                            Wir bieten kostenlose Rechtsberatung für Berliner
                            Mietende in Fragen des Mietpreisrechts. Unsere
                            Teilnehmenden werden Expert:innen in der Einordnung
                            von Mietwohnungen in den Berliner Mietspiegel. Sie
                            können dich also in Bezug auf die Mietpreisbremse
                            und in Fragen einer möglicherweise unberechtigten
                            Mieterhöhung gem. § 558 BGB berate.
                          </p>
                          <p>
                            Die Beratungen erfolgen alle unter Supervision von
                            mietrechtlich ausgebildeten Volljurist:innen.
                          </p>
                        </>
                      ),
                      en: (
                        <>
                          <p>
                            Mieten Law Clinic Berlin e. V. is an initiative of
                            people who are academically or practically active in
                            tenancy law. We have joined forces and founded the
                            Mieten Law Clinic Berlin to bring tenancy law closer
                            to students and to help Berlin tenants legalize
                            their rents.
                          </p>
                          <p>
                            We offer free legal advice for Berlin tenants on
                            rent price law. Our participants become experts in
                            classifying rental apartments in the Berlin rent
                            index. They can therefore advise you on the rent
                            freeze and on questions of a potentially unjustified
                            rent increase pursuant to Section 558 BGB.
                          </p>
                          <p>
                            All consultations are conducted under the
                            supervision of fully qualified lawyers with training
                            in tenancy law.
                          </p>
                        </>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Was ist Mietencheck?",
                      en: "What is Mietencheck?",
                    },
                    answer: {
                      de: (
                        <p>
                          Mietencheck ist Projekt der Mieten Law Clinic. Du
                          kannst hier kostenlos und möglichst rechtssicher eine
                          Einschätzung erhalten, ob die Höhe deiner aktuelle
                          Miete oder anstehende Mieterhöhung legal ist. Wir
                          aktualisieren für dich regelmäßig das Tool mit den
                          neuesten Mietspiegeln und Gesetzesänderungen, damit du
                          deine Rechte checken kannst!
                        </p>
                      ),
                      en: (
                        <p>
                          Mietencheck is a project of the Mieten Law Clinic.
                          Here you can receive a free and legally sound
                          assessment of whether the amount of your current rent
                          or an upcoming rent increase is legal. We regularly
                          update the tool with the latest rent indexes and
                          legislative changes so you can check your rights!
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Wie kann ich mich beraten lassen?",
                      en: "How can I get advice?",
                    },
                    answer: {
                      de: (
                        <p>
                          Bitte füll den Fragebagen hier auf Mietencheck
                          komplett aus. Sollte deine Miete potentiell zu hoch
                          sein oder die anstehende Mieterhöhung potentiell nicht
                          zulässig, kannst du im letzten Schritt des Fragebogens
                          eine kostenlose Beratung anfordern. Unsere
                          Berater:innen werden sich dann so schnell wie möglich
                          bei dir melden.
                        </p>
                      ),
                      en: (
                        <p>
                          Please fill out the questionnaire here on Mietencheck
                          completely. If your rent is potentially too high or
                          the upcoming rent increase is potentially not
                          permitted, you can request a free consultation in the
                          last step of the questionnaire. Our advisors will get
                          back to you as soon as possible.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Wie verläuft eine Beratung?",
                      en: "What does a consultation involve?",
                    },
                    answer: {
                      de: (
                        <>
                          <p>
                            Nachdem du eine Beratung beauftragt hast, werden
                            unsere Berater:innen deine Angaben überprüfen. In
                            einigen Fällen werden sie dich bezüglich Rückfragen
                            oder benötigter Dokumente kontaktieren.
                          </p>
                          <p>
                            Wenn alle notwendigen Informationen für die
                            Einordnung deiner Wohnung in den Berliner
                            Mietspiegel vorhanden sind, werden sie dir
                            mitteilen, ob du zu viel Miete zahlst oder das
                            Mieterhöhungsverlangen deines Vermieters rechtmäßig
                            ist. Die Berater:innen beachten hier alle möglichen
                            Besonderheiten und besprechen mit dir deine konkrete
                            Rechtslage. Die Beratung kann entweder in Person in
                            Berlin oder am Telefon stattfinden.
                          </p>
                          <p>
                            Falls deine ursprüngliche Miete oder das
                            Mieterhöhungsverlangen nicht legal sind, werden
                            unsere Berater:innen dich über mögliche rechtliche
                            Schritte informieren. Du bist aber in keiner Weise
                            von uns dazu angehalten, diese rechtlichen Schritte
                            einzuleiten. Die Frage der Rechtsdurchsetzung ist
                            immer sehr sensibel und von vielen Einzelheiten in
                            der konkreten Situation abhängig. Wir bieten dir
                            daher an, dich mit unseren Berater:innen zu
                            besprechen, aber letztlich liegt die Frage, ob und
                            wie du handeln möchtest, ganz allein bei dir.
                          </p>
                          <p>
                            Falls du dich dafür entscheiden solltest, deinen
                            Vermieter zu kontaktieren und dieser nicht reagiert
                            oder dein Recht negiert, dann können wir dich
                            zuletzt an unser Netzwerk aus Mietrechtsanwält:innen
                            weiter vermitteln.
                          </p>
                        </>
                      ),
                      en: (
                        <>
                          <p>
                            After you have requested a consultation, our
                            advisors will review your information. In some
                            cases, they will contact you regarding follow-up
                            questions or required documents.
                          </p>
                          <p>
                            When all necessary information for classifying your
                            apartment in the Berlin rent index is available,
                            they will inform you whether you are paying too much
                            rent or whether your landlord&apos;s rent increase
                            request is lawful. The advisors take into account
                            all possible special circumstances and discuss your
                            specific legal situation with you. The consultation
                            can take place either in person in Berlin or by
                            phone.
                          </p>
                          <p>
                            If your original rent or the rent increase request
                            is not legal, our advisors will inform you about
                            possible legal steps. However, you are in no way
                            obliged by us to take these legal steps. The
                            question of legal enforcement is always very
                            sensitive and depends on many details in the
                            specific situation. We therefore offer you the
                            opportunity to discuss this with our advisors, but
                            ultimately the question of whether and how you want
                            to act is entirely up to you.
                          </p>
                          <p>
                            If you decide to contact your landlord and they do
                            not respond or deny your rights, we can finally
                            refer you to our network of tenancy lawyers.
                          </p>
                        </>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Ist das wirklich kostenlos?",
                      en: "Is it really free?",
                    },
                    answer: {
                      de: (
                        <p>
                          Ja, sowohl unsere Rechtsberatung als auch unser
                          Rechner ist wirklich kostenlos.
                        </p>
                      ),
                      en: (
                        <p>
                          Yes, both our legal advice and our calculator are
                          really free.
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Warum macht ihr das?",
                      en: "Why are you doing this?",
                    },
                    answer: {
                      de: (
                        <p>
                          Wir wollen den Mietenden in Berlin dabei helfen, ihre
                          Rechte durchzusetzen. Viele Mietende wissen nicht,
                          dass die Miethöhe überhaupt reguliert ist und dass sie
                          Rechte haben, die der Vermieter beachten muss. Die
                          Rechtsdurchsetzung im Wohnraummietrecht ist für die
                          Mieter:innen häufig mit Angst verbunden. Wir wollen
                          Mieter:innen ermutigen und unterstützen in der
                          Durchsetzung ihres Rechts auf eine legale Miete!
                        </p>
                      ),
                      en: (
                        <p>
                          We want to help tenants in Berlin enforce their
                          rights. Many tenants do not know that rent levels are
                          regulated at all and that they have rights that the
                          landlord must respect. Legal enforcement in
                          residential tenancy law is often associated with fear
                          for tenants. We want to encourage and support tenants
                          in enforcing their right to a legal rent!
                        </p>
                      ),
                    },
                  },
                  {
                    question: {
                      de: "Kann ich euch unterstützen?",
                      en: "Can I support you?",
                    },
                    answer: {
                      de: (
                        <>
                          <p>
                            Ja! Du kannst uns mit einer Spende unterstützen
                            (denn unser Netzwerk aus Mietrechtsanwält:innen und
                            Ehrenamtlichen kostet auch Geld) oder bei uns
                            mitmachen. Schreib uns einfach eine E-Mail an{" "}
                            <a
                              className="underline"
                              href="mailto:kontakt@mietenlawclinic.de"
                            >
                              kontakt@mietenlawclinic.de
                            </a>{" "}
                            und wir laden Dich zu unserem nächsten offenen
                            Plenum ein!
                          </p>
                          <p>
                            Spenden kannst Du an unseren gemeinnützigen Verein:
                          </p>
                          <p>
                            Mieten Law Clinic Berlin e. V. <br />
                            IBAN: DE45 8306 5408 0006 8993 31 <br />
                            BIC: GENODEF1SLR
                          </p>
                          <p>
                            Bei Spenden bis zu 300 Euro im Jahr akzeptiert das
                            Finanzamt auch den Überweisungsbeleg als Nachweis.
                            Auf Wunsch stellen wir aber auch gesonderte
                            Spendenbescheinigungen aus.
                          </p>
                        </>
                      ),
                      en: (
                        <>
                          <p>
                            Yes! You can support us with a donation (because our
                            network of tenancy lawyers and volunteers also costs
                            money) or join us. Simply send us an email at{" "}
                            <a
                              className="underline"
                              href="mailto:kontakt@mietenlawclinic.de"
                            >
                              kontakt@mietenlawclinic.de
                            </a>{" "}
                            and we will invite you to our next open plenary
                            meeting!
                          </p>
                          <p>You can donate to our non-profit association:</p>
                          <p>
                            Mieten Law Clinic Berlin e. V. <br />
                            IBAN: DE45 8306 5408 0006 8993 31 <br />
                            BIC: GENODEF1SLR
                          </p>
                          <p>
                            For donations of up to 300 euros per year, the tax
                            office also accepts the bank transfer receipt as
                            proof. On request, we can also issue separate
                            donation certificates.
                          </p>
                        </>
                      ),
                    },
                  },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`mc-${i}`}>
                    <AccordionTrigger className="text-left heading-20 [&>svg]:text-gray-11 [&>svg]:h-7 [&>svg]:w-7">
                      {l(item.question)}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2 pl-[38px] text-gray-11 text-lg">
                      {l(item.answer)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
