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
      <section className="bg-purple-9">
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
                      de: "Die Mietpreisbremse ist ein Gesetz, das den rasanten Anstieg der Mietpreise bremsen soll. Die Mietpreisbremse soll einerseits verhindern, dass neue Mietverträge mit zu hohen Mietpreisen abgeschlossen werden und andererseits ermöglichen, dass zu hohe Mieten gesenkt werden.",
                      en: "The Rent Control Act is a law designed to slow down the rapid rise in rents. On the one hand, the rent freeze is intended to prevent new rental agreements being concluded with excessively high rents and, on the other, to enable excessively high rents to be reduced.",
                    },
                  },
                  {
                    question: {
                      de: "Was bringt die Mietpreisbremse?",
                      en: "What are the benefits of the Rent Control Act?",
                    },
                    answer: {
                      de: "Ziehst Du erfolgreich die Mietpreisbremse, musst Du zukünftig deutlich weniger Miete bezahlen und kannst die zu viel bezahlte Miete zurückverlangen. Außerdem gilt: Wenn viele Menschen erfolgreich ihre Miete senken, wird auch der Mietspiegel niedrig gehalten. Das ist wichtig, weil der Mietspiegel der Maßstab für die zulässigen Miethöhen ist.",
                      en: "If you successfully apply the rent freeze, you will have to pay significantly less rent in future and can reclaim the rent you have paid in excess. In addition, if many people successfully reduce their rent, the rent index will also be kept low. This is important because the rent index is the benchmark for permissible rent levels. ",
                    },
                  },
                  {
                    question: {
                      de: "Gilt die Mietpreisbremse in ganz Berlin?",
                      en: "Does the Rent Control apply throughout Berlin?",
                    },
                    answer: {
                      de: "Die Mietpreisbremse gilt seit 2015 in ganz Berlin, denn die Mieten steigen überall sehr schnell und bezahlbarer Wohnraum ist kaum zu finden. Alle gesetzlichen Kriterien zur Bestimmung eines „angespannten Wohnungsmarktes“ sind in ganz Berlin erfüllt.",
                      en: "The Rent Control Act has been applied throughout Berlin since 2015, because rents are rising very quickly everywhere and affordable housing is hard to find. All legal criteria for determining a “tight housing market” are met throughout Berlin.",
                    },
                  },
                  {
                    question: {
                      de: "Gilt die Mietpreisbremse für alle Wohnungen?",
                      en: "Does the Rent Control apply to all apartments?",
                    },
                    answer: {
                      de: "Leider nein, es gibt ein paar Ausnahmen. Ob du die Mietpreisbremse ziehen kannst, findest du mit unserem Rechner heraus!",
                      en: "Unfortunately no, there are a few exceptions. Use our calculator to find out whether you can apply the Rent Control! ",
                    },
                  },
                  {
                    question: {
                      de: "Wie hoch darf die zulässige Miete sein?",
                      en: "How high can the permitted rent be?",
                    },
                    answer: {
                      de: "Die zulässige Miete richtet sich nach der ortsüblichen Vergleichsmiete. Diese wird in Berlin in der Regel nach dem Mietspiegel bestimmt. Zudem gibt es weitere Faktoren, die die zulässige Miethöhe beeinflussen können. Insbesondere durchgeführte Modernisierungsmaßnahmen können die zulässige Miete erhöhen.",
                      en: "The permissible rent is based on the local comparative rent. In Berlin, this is usually determined according to the rent index. There are also other factors that can influence the permissible rent. In particular, modernization measures carried out can increase the permissible rent.",
                    },
                  },
                  {
                    question: {
                      de: "Was ist der Mietspiegel?",
                      en: "What is the rent index?",
                    },
                    answer: {
                      de: "Der Mietspiegel weist aus, wie hoch die Miete in den unterschiedlichen Berliner Gegenden sein darf. Um das festzulegen orientiert er sich an dem Durchschnitt der schon bestehenden Mieten in den jeweiligen Gegenden.",
                      en: "The rent index shows how high the rent may be in the different areas of Berlin. To determine this, it is based on the average of existing rents in the respective areas.",
                    },
                  },
                  {
                    question: {
                      de: "Was mache ich, wenn meine Miete zu hoch ist?",
                      en: "What do I do if my rent is too high?",
                    },
                    answer: {
                      de: "Mieter*innen müssen einen Verstoß gegen die Mietpreisbremse rügen. Hierzu solltest Du Deinem*r Vermieter*in schriftlich die ermittelte zulässige Miethöhe mitteilen. Dein*e Vermieter*in muss dir die Auskünfte geben, die für die Prüfung der zulässigen Miethöhe benötigt werden, wenn du ihn*sie dazu aufforderst. Ausführliche Informationen zu Deinen Handlungsoptionen findest du in unserem Ratgeber.",
                      en: "Tenants must report a violation of the rent freeze. To do this, you should inform your landlord in writing of the determined permissible rent level. Your landlord must provide you with the information required to check the permissible rent level if you ask him/her to do so. You can find detailed information in our guide.",
                    },
                  },
                  {
                    question: {
                      de: "Kann ich nach der Rüge einfach weniger Miete bezahlten?",
                      en: "Can I simply pay less rent after the complaint?",
                    },
                    answer: {
                      de: "Nein, das solltest Du auf keinen Fall tun! Es ist nicht auszuschließen, dass Du Dich bei der Berechnung der zulässigen Miete geirrt hast oder ein Gericht zu einer unvorhersehbaren Rechtsauffassung gelangt. In diesem Fall könntest Du schnell in einen Zahlungsverzug kommen. Dieser kann im schlimmsten Fall zu einer Kündigung durch Deine*n Vermieter*in führen.",
                      en: "No, you should never do that! It cannot be ruled out that you have made a mistake in calculating the permissible rent or that a court has come to an unforeseeable legal conclusion. In this case, you could quickly fall into arrears. In the worst case scenario, this could lead to your landlord giving you notice to quit.",
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
                {l({ de: "mietencheck.de", en: "mietencheck.de" })}
              </h3>
              <Accordion type="single" collapsible className="gap-4">
                {[
                  {
                    question: {
                      de: "Wer sind wir?",
                      en: "Who are we?",
                    },
                    answer: {
                      de: "Wir sind die Kampagne Deutsche Wohnen & Co enteignen. Wir wollen bezahlbaren Wohnraum für alle. Bei unserem Volksentscheid im Jahr 2021 haben 59,1 % der Berliner*innen für die Vergesellschaftung großer Wohnungskonzerne gestimmt. Da der Berliner Senat die Umsetzung des Volksentscheids blockiert, planen wir einen Gesetzes-Volksentscheid. Die Umsetzung eines erfolgreichen Gesetzes-Volksentscheids wäre verbindlich.",
                      en: "We are the campaign to expropriate Deutsche Wohnen & Co. We want affordable housing for everyone. In our referendum in 2021, 59.1% of Berliners voted for the socialization of large housing companies. Since the Berlin Senate is blocking the implementation of the referendum, we are planning a legislative referendum. The implementation of a successful legislative referendum would be binding.",
                    },
                  },
                  {
                    question: {
                      de: "Ist das wirklich kostenlos?",
                      en: "Is it really free?",
                    },
                    answer: {
                      de: "Ja, unser Rechner ist wirklich kostenlos",
                      en: "Yes, our calculator is really free",
                    },
                  },
                  {
                    question: {
                      de: "Warum macht ihr das?",
                      en: "Why are you doing this?",
                    },
                    answer: {
                      de: "Wir wollen, dass möglichst viele Mieter*innen die Mietpreisbremse ziehen. Denn wir wollen bezahlbaren Wohnraum für alle Berliner*innen.",
                      en: "We want as many tenants as possible to use the rent cap. Because we want affordable housing for all Berliners.",
                    },
                  },
                  {
                    question: {
                      de: "Was passiert mit meinen Daten?",
                      en: "What happens to my data?",
                    },
                    answer: {
                      de: "Die Antworten zu den einzelnen Merkmalen des Mietenchecks bzw. Mietspiegels werden auf unseren Servern gespeichert. Dabei werden allerdings keine personenbezogenen Daten gespeichert, insbesondere erfolgt die Speicherung also ohne die angegebenen Adressdaten der Nutzer*innen. Adressdaten der Nutzer*innen werden ausschließlich dann auf unseren Servern gespeichert, wenn die Nutzer*innen sich einen Link zur späteren Weiterbeantwortung des Mietenchecks - gegebenenfalls auf einem anderen Gerät - zuschicken lassen und dabei explizit in die Speicherung ihrer Adressdaten zu diesem Zweck eingewilligt haben.",
                      en: "The answers to the individual features of the rent check or rent index are stored on our servers. However, no personal data is stored in this process; in particular the storage takes place without the specified address data of the users. Users' address data is only stored on our servers if the users have a link sent to them for later answering the rent check - possibly on another device - and have explicitly consented to the storage of their address data for this purpose.",
                    },
                  },
                  {
                    question: {
                      de: "Kann ich euch unterstützen?",
                      en: "Can I support you?",
                    },
                    answer: {
                      de: "Ja! Hier findest du alle Möglichkeiten zum Mitmachen: https://dwenteignen.de/mitmachen",
                      en: "Yes! Here you can find all the options for getting involved: https://dwenteignen.de/mitmachen",
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
