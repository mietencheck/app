import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components";
import { useLocaleState, useLocalizeField } from "~/l10n";

import { Layout } from "./layout";

export default function LandingPage() {
  const l = useLocalizeField();

  const { locale } = useLocaleState();

  return (
    <Layout>
      <section className="bg-purple-9">
        <div className="container pt-14 pb-36 text-center">
          <h1 className="mx-auto max-w-[600px] title-52 sm:title-56 md:title-64 lg:title-72 text-yellow-11 mb-12">
            {l("Ganz Berlin zahlt zu viel Miete.")}
          </h1>
          <div className="mx-auto inline-flex flex-col gap-2 items-center  text-purple-11 transform -rotate-6">
            <span className="hidden sm:inline-block title-40 md:title-44 px-4 py-3 bg-yellow-9">
              {l("Kannst du deine senken?")}
            </span>
            <span className="inline-block w-fit sm:hidden title-36 px-4 py-3 bg-yellow-9">
              {l("Kannst du")}
            </span>
            <span className="inline-block w-fit sm:hidden title-36 px-4 py-3 bg-yellow-9">
              {l("deine senken?")}
            </span>
          </div>
        </div>
      </section>
      <section className="bg-yellow-11">
        <div className="container py-8 flex gap-10 items-center justify-center">
          <p className="text-base-medium text-purple-11">
            {l("Eine Initiative von")}
          </p>
          <a href="https://dwenteignen.de/" target="_blank">
            <img
              src="images/dwe-logo.svg"
              alt="Deutsche Wohnen & Co Enteignen Logo"
            />
          </a>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-purple-11 text-center">
            {l("Check jetzt deine Miete!")} <br className="hidden sm:block" />{" "}
            {l("Kostenlos und sicher.")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-10">
            <a href="/schnelltest">
              <div className="p-6 sm:p-8 bg-purple-3 text-purple-11">
                <h3 className="title-24 lg:title-28 mb-3">
                  {l("Miete überprüfen")}
                </h3>
                <p className="text-lg-book mb-6">
                  {l(
                    "Finde heraus, ob du für deine aktuelle oder neue Wohnung zu viel Miete zahlst.",
                  )}
                </p>
                <span className="inline-block px-4 py-3 text-base-book bg-purple-9 text-white rounded-full hover:bg-purple-10">
                  {l("Jetzt checken")}
                </span>
              </div>
            </a>
            <div className="px-4 py-6 sm:p-8 bg-purple-3 text-purple-11">
              <h3 className="title-24 lg:title-28 mb-3">
                {l("Mieterhöhung überprüfen")}
              </h3>
              <p className="text-lg-book mb-6">
                {l(
                  "Hast du eine Mieterhöhung bekommen? Finde heraus, ob die Erhöhung rechtens ist.",
                )}
              </p>
              <span className="inline-block px-4 py-3 text-base-book bg-purple-9 text-white rounded-full opacity-50">
                {l("Bald verfügbar")}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-purple-11 text-center">
            <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
              {l("So funktioniert's")}
            </span>
          </h2>

          <div className="mx-auto max-w-screen-lg space-y-16 sm:space-y-12">
            {[
              {
                image: "images/landing/so-funktionierts-01.jpg",
                imageEn: "images/landing/so-funktionierts-01-en.jpg",
                alt: l("Screenshot einer Prognose"),
                number: "1",
                title: l("Mach den Schnell-Test"),
                description: l(
                  "Finde in 5 Minuten heraus, ob du die Miete für deine aktuelle oder neue Wohnung potentiell höher als erlaubt ist.",
                ),
              },
              {
                image: "images/landing/so-funktionierts-02.jpg",
                imageEn: "images/landing/so-funktionierts-02-en.jpg",
                alt: l("Screenshot einer Frage"),
                number: "2",
                title: l(
                  "Ermittle die zulässige Höchstmiete für deine Wohnung",
                ),
                description: l(
                  "Fülle unseren Fragebogen aus und finde ganz einfach heraus, wie hoch die Miete für deine Wohnung maximal sein darf.",
                ),
              },
              {
                image: "images/landing/so-funktionierts-03.jpg",
                imageEn: "images/landing/so-funktionierts-03-en.jpg",
                alt: l("Screenshot eines Resultates"),
                number: "3",
                title: l("Setze dein Recht auf eine günstigere Miete durch"),
                description: l(
                  "Wir zeigen dir deine Möglichkeiten, wie du dein Recht auf eine günstigere Miete am besten durchsetzen kannst.",
                ),
              },
            ].map((item) => (
              <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                <div className="w-full lg:pr-4">
                  <img
                    src={locale == "de" ? item.image : item.imageEn}
                    alt={item.alt}
                  />
                </div>
                <div className="w-full flex flex-col justify-center text-purple-11">
                  <span className="flex items-center justify-center h-6 w-6 mb-4 border-2 border-purple-9 text-lg-medium text-center rounded-full">
                    {item.number}
                  </span>
                  <h3 className="title-24 mb-2">{item.title}</h3>
                  <p className="text-lg-book">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-purple-11 text-center">
            <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
              {l("Über Uns")}
            </span>
          </h2>

          <div className="flex flex-col gap-10 sm:flex-row">
            <div className="w-full lg:pr-4">
              <img
                src={"images/landing/wer-wir-sind.jpg"}
                alt="Bild von zwei Aktiviten*innen"
              />
            </div>
            <div className="w-full flex flex-col justify-center text-purple-11">
              <h3 className="title-28 md:title-32 mb-4 md:mb-6">
                {l(
                  "Wir sind Berliner Mieter*innen und haben den Mietenwahnsinn satt!",
                )}
              </h3>
              <p className="text-lg-book mb-8">{l("Über Uns Text")}</p>
              <a
                className="inline-block w-fit px-4 py-3 bg-purple-9 text-white text-base-book rounded-full hover:bg-purple-10"
                href="/ueber-uns"
              >
                {l("Mehr erfahren")}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="flex flex-col items-center gap-y-2 title-36 sm:title-40 md:title-44 lg:title-48 text-purple-11 text-center transform -rotate-6">
            <span className="hidden sm:inline-block w-fit px-4 py-3 bg-yellow-9 text-purple-11">
              {l("Häufig gestellte Fragen")}
            </span>
            <span className="inline-block sm:hidden w-fit px-4 py-3 bg-yellow-9 text-purple-11">
              {l("Häufig gestellte")}
            </span>
            <span className="inline-block sm:hidden w-fit px-4 py-3 bg-yellow-9 text-purple-11">
              {l("Fragen")}
            </span>
          </h2>

          <div className="flex flex-col gap-10 md:flex-row text-purple-11">
            <div className="w-full">
              <h3 className="title-28 md:title-32 mb-8">Mietpreisbremse</h3>
              <Accordion type="single" collapsible className="gap-4">
                {[
                  { question: l("FAQ 1 Frage"), answer: l("FAQ 1 Antwort") },
                  { question: l("FAQ 2 Frage"), answer: l("FAQ 2 Antwort") },
                  { question: l("FAQ 3 Frage"), answer: l("FAQ 3 Antwort") },
                  { question: l("FAQ 4 Frage"), answer: l("FAQ 4 Antwort") },
                  { question: l("FAQ 5 Frage"), answer: l("FAQ 5 Antwort") },
                  { question: l("FAQ 6 Frage"), answer: l("FAQ 6 Antwort") },
                  { question: l("FAQ 7 Frage"), answer: l("FAQ 7 Antwort") },
                  { question: l("FAQ 8 Frage"), answer: l("FAQ 8 Antwort") },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left heading-20 [&>svg]:text-purple-11 [&>svg]:h-7 [&>svg]:w-7">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base-book space-y-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="w-full">
              <h3 className="title-28 md:title-32 mb-8">mietencheck.de</h3>
              <Accordion type="single" collapsible className="gap-4">
                {[
                  { question: l("FAQ 9 Frage"), answer: l("FAQ 9 Antwort") },
                  { question: l("FAQ 10 Frage"), answer: l("FAQ 10 Antwort") },
                  { question: l("FAQ 11 Frage"), answer: l("FAQ 11 Antwort") },
                  { question: l("FAQ 12 Frage"), answer: l("FAQ 12 Antwort") },
                  { question: l("FAQ 13 Frage"), answer: l("FAQ 13 Antwort") },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left heading-20 [&>svg]:text-purple-11 [&>svg]:h-7 [&>svg]:w-7">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base-book space-y-2">
                      {item.answer}
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
