import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components";
import { useInlineLocale, useLocaleState } from "~/l10n";
import { EintragenForm } from "~/pages/eintragen/EintragenForm";

export function BeratungSection() {
  const [showEintragen, setShowEintragen] = useState(false);
  const l = useInlineLocale();
  const { locale } = useLocaleState();

  return (
    <>
      <hr className="border-gray-6 my-8" />
      <div>
        <h2 className="heading-20 mb-4">
          {l({
            de: "Kostenlose Rechtsberatung der Mieten Law Clinic",
            en: "Free legal advice from Mieten Law Clinic",
          })}
        </h2>
        <p className="text-base text-gray-11 mb-3">
          {l({
            de: "Die Mieten Law Clinic Berlin e. V. bietet eine kostenlose Rechtsberatung für Berliner:innen in Fragen des Mietpreisrechts.  Unsere Berater:innen überprüfen deine Angaben hier auf Mietencheck, und können dich nach Einsicht weiterer Dokumente (wie z.B. dein Mietvertrag) über potentielle rechtliche Schritte für deinen Fall informieren.",
            en: "Mieten Law Clinic Berlin e.V. offers free legal advice for Berlin residents on rent control law. Our advisors will review your information on Mietencheck and, after reviewing further documents (such as your rental agreement), can inform you about potential legal steps for your case.",
          })}
        </p>
        <p className="text-base text-gray-11 mb-8">
          {l({
            de: 'Weitere Informationen zu unserem Beratungsangebot findest du in der "Häufig gestellte Fragen" Sektion auf unser Startseite.',
            en: 'You can find more information about our advisory services in the "Frequently asked questions" section on our homepage.',
          })}
        </p>
        <Dialog open={showEintragen} onOpenChange={setShowEintragen}>
          <DialogTrigger
            nativeButton
            render={
              <Button>
                {l({
                  de: "Jetzt kostenlose Beratung anfordern",
                  en: "Request free legal advice now",
                })}
              </Button>
            }
          />
          <DialogContent className="max-h-[85vh] max-w-lg overflow-auto">
            <EintragenForm key="eintragen-dialog" layout="dialog" />
          </DialogContent>
        </Dialog>
      </div>

      <hr className="border-gray-6 my-8" />

      <div>
        <h2 className="heading-20 mb-4">
          {l({
            de: "Weitere Beratungsangebote",
            en: "Other advisory services",
          })}
        </h2>
        <p className="text-base text-gray-11 mb-8">
          {l({
            de: "Neben der Beratung durch die Mieten Law Clinic, gibt es natürlich auch eine Vielzahl weiterer Beratungsangebote. Hier ist eine Auswahl von Angeboten, die wir empfehlen können:",
            en: "In addition to advice from Mieten Law Clinic, there are of course many other advisory services available. Here is a selection of services we can recommend:",
          })}
        </p>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left text-base-medium">
              {l({
                de: "Kostenlose Beratung durch Berliner Mieter*innenvereinigung",
                en: "Free advice from the Berlin tenants' association",
              })}
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-5 pl-7">
              <div className="space-y-2 text-gray-11">
                <p>
                  {l({
                    de: "Mieter*innenvereinigung, wie z.B. der Berliner Mieterverein, bieten für ihre Mitglieder regelmäßige kostenlose Beratungen mit Rechtsanwält*innen in allen Berliner Bezirken an.",
                    en: "Tenants' associations, such as the Berlin tenants' association, offer their members regular free consultations with lawyers in all Berlin districts.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Wenn du bereits Mitglied bei der Mietergemeinschaft oder dem Mieterverein warst, bevor du deinen Mietvertrag unterschrieben hast, dann übernimmt die Prozesskosten-Versicherung sogar die Kosten, sollte dein Fall vor Gericht kommen.",
                    en: "If you were already a member of the tenants' community or the tenants' association before you signed your rental agreement, then the legal costs insurance will even cover the costs if your case goes to court.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Wenn du jetzt neu Mitglied wirst, dann kannst du dort in jedem Fall die kostenlosen Beratungsleistungen in Anspruch nehmen, hast aber keine Versicherung, sollte dein Fall vor Gericht gehen.",
                    en: "If you become a new member now, then you can definitely take advantage of the free advice services there, but you have no insurance if your case goes to court.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Außerdem sind die Mieter*innenvereine die politische Interessenvertretung von uns Mieter*innen. Es ist also für jede*n Mieter*in sinnvoll, dort Mitglied zu werden.",
                    en: "In addition, the tenants' associations are the political interest groups of us tenants. So it makes sense for every tenant to become a member.",
                  })}
                </p>
              </div>
              <a
                className="block text-base underline mt-4 text-gray-12"
                href={locale === "de" ? "/de/blog" : "/en/blog"}
              >
                {l({ de: "Mehr Informationen", en: "More information" })}
              </a>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-base-medium">
              {l({
                de: "Kostenlose Mieter*innenberatung von Berliner Bezirken",
                en: "Free tenant advice from Berlin districts",
              })}
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-5 pl-7">
              <div className="space-y-2 text-gray-11">
                <p>
                  {l({
                    de: "Alle Berliner Bezirke haben eine Mieter*innenberatung, die Bewohner*innen kostenlos des Bezirks nutzen können. Mietrechtsexpertinnen können dich dort zu deinen Ergebnissen oder nächsten Schritten beraten.",
                    en: "All Berlin districts have a tenant advice service that residents of the district can use free of charge. Tenancy law experts can advise you there on your results or next steps.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Die Bezirke bieten jedoch keine Rechtsvertretung vor Gericht an. Sollte dein*e Vermieter*in sich weigern, deine Miete zu senken, kannst du dich entscheiden, dein Recht vor Gericht einzuklagen. Dafür musst du eine*n kostenpflichtige*n Rechtsanwält*in hinzuziehen.",
                    en: "However, the districts do not offer legal representation in court. If your landlord refuses to reduce your rent, you can decide to assert your rights in court. To do this, you must hire a lawyer for a fee.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Um einen Termin für eine Mietberatung zu vereinbaren, klicke auf “Mehr Informationen” für eine Übersicht zu den Beratungszeiten und -orten in deinem Bezirk.",
                    en: 'To make an appointment for tenancy law advice, click on "More information" for an overview of the consultation times and locations in your district.',
                  })}
                </p>
              </div>
              <a
                className="block text-base underline mt-4 text-gray-12"
                href={locale === "de" ? "/de/blog" : "/en/blog"}
              >
                {l({ de: "Mehr Informationen", en: "More information" })}
              </a>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-base-medium">
              {l({
                de: "Kostenpflichtige Beratung von Rechtsanwält*in",
                en: "Paid advice from a lawyer",
              })}
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-5 pl-7">
              <div className="space-y-2 text-gray-11">
                <p>
                  {l({
                    de: "Du kannst ebenfalls direkt ein*e Rechtsanwält*in beauftragen dein Ergebnis zu überprüfen und eventuelle Fragen zu beantworten. Diese Beratung ist jedoch kostenpflichtig. Dafür kannst du unter Umständen Beratungshilfe beantragen.",
                    en: "You can also hire a lawyer directly to check your results and answer any questions you may have. However, this advice is subject to a fee. You may be able to apply for legal aid for this.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Zudem kannst du auch eine Rechtsanwält*in beauftragen dein Recht vor Gericht einzuklagen, sollte sich dein*e Vermieter*in weigern deine Miete zu senken. Dabei trägst du das Risiko, solltest du verlieren und keine Rechtsschutzversicherung haben, die die Kosten übernimmt.",
                    en: "You can also hire a lawyer to enforce your rights in court if your landlord refuses to reduce your rent. You bear the risk if you lose and do not have legal protection insurance to cover the costs.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Wir haben für dich eine Liste mit spezialisierten Rechtsanwält*innen vorbereitet, zusammen mit einer Übersicht zu möglichen Kosten und Informationen zur Beratungshilfe.",
                    en: "We have prepared a list of specialized lawyers for you, along with an overview of possible costs and information on legal aid.",
                  })}
                </p>
              </div>
              <a
                className="block text-base underline mt-4 text-gray-12"
                href={locale === "de" ? "/de/blog" : "/en/blog"}
              >
                {l({ de: "Mehr Informationen", en: "More information" })}
              </a>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-base-medium">
              {l({
                de: "Kostenpflichtige Beratung durch Dritt-Anbieter",
                en: "Paid advice from a third-party provider",
              })}
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-5 pl-7">
              <div className="space-y-2 text-gray-11">
                <p>
                  {l({
                    de: "Du kannst auch einen kommerzielle Anbieter, wie z.B. Conny, beauftragen die Mietpreisbremse für dich durchzusetzen. Der Vorteil dieser kommerzielle Anbieten ist, dass sie das Kostenrisiko für dich tragen. Sollte es z.B. zu einem gerichtlichen Verfahren kommen, tragen die Anbieter die Kosten hierfür.",
                    en: "You can also hire a commercial provider, such as Conny, to enforce the rent cap for you. The advantage of these commercial providers is that they bear the cost risk for you. If, for example, legal proceedings are initiated, the providers will bear the costs.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Der Nachteil dieser Anbieter ist jedoch, dass sie einen Anteil von dem Geld, das du zukünftig sparst, einbehalten. Gerade wenn du deutlich zu viel Miete zahlst, ist dieser Anteil sehr hoch.",
                    en: "The disadvantage of these providers, however, is that they keep a portion of the money you save in the future. This portion is particularly high if you pay significantly too much rent.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Bei Conny gibt es zudem noch weitere Dinge zu beachten: Conny nimmt nicht alle Fälle an, in denen du zu viel Miete zahlst. Es kann in manchen Fällen auch sehr lange dauern, bis Conny deinen Fall bearbeitet.",
                    en: "There are also other things to consider with Conny: Conny does not accept all cases in which you pay too much rent. In some cases, it can take a very long time for Conny to process your case.",
                  })}
                </p>
                <p>
                  {l({
                    de: "Wichtig: Sobald du Conny beauftragt hast, kannst du dich nicht mehr entscheiden, selbständig aktiv zu werden. Conny verlangt hohe Entschädigungssummen, solltest du zu einem späteren Zeitpunkt aus dem Vertrag austreten wollen.",
                    en: "Important: Once you have commissioned Conny, you can no longer decide to take action on your own. Conny demands high compensation amounts if you want to withdraw from the contract at a later date.",
                  })}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <hr className="border-gray-6 my-8" />
      <div>
        <h2 className="heading-20 mb-4">
          {l({ de: "Disclaimer", en: "Disclaimer" })}
        </h2>
        <p className="text-base text-gray-11">
          {l({
            de: "Unser Ergebnis basiert auf deinen Angaben und ersetzt keine rechtliche Beratung. Im Einzelfall kann die rechtliche Bewertung anders ausfallen.",
            en: "Our result is based on your information and does not replace legal advice. In individual cases, the legal assessment may differ.",
          })}
        </p>
      </div>
    </>
  );
}
