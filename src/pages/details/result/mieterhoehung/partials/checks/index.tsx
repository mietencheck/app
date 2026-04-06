import cx from "classnames";
import { CircleCheckIcon, CircleXIcon, HelpCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components";
import { useInlineLocale } from "~/l10n";

import type { ResultMieterhoehungTypes } from "../../index";

function CheckAccordionItem({
  value,
  title,
  subtitle,
  icon,
  children,
  className,
}: {
  value: string;
  title: ReactNode;
  subtitle: ReactNode;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AccordionItem
      value={value}
      className={cx(
        "group border border-gray-7 rounded overflow-hidden [&>h3]:m-0 hover:border-gray-8",
        className,
      )}
    >
      <AccordionTrigger className="w-full px-3 py-2 hover:bg-gray-1 hover:no-underline flex-row-reverse justify-between [&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:rotate-180">
        <div className="flex-grow text-left">
          <h4 className="text-base-book mb-0.5">{title}</h4>
          <p className="text-base text-gray-11">{subtitle}</p>
        </div>
        <div className="flex justify-center items-center h-[24px]">{icon}</div>
      </AccordionTrigger>
      <AccordionContent className="py-2 pr-3 pl-9 text-gray-11 border-t border-gray-7 group-hover:border-gray-8">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

export function ResultMieterhoehungChecks({
  result,
}: {
  result: ResultMieterhoehungTypes;
}) {
  const l = useInlineLocale();

  return (
    <Accordion type="single" collapsible>
      <CheckAccordionItem
        value="voraussetzungen"
        title="Formale Vorausetzungen"
        subtitle="Alle formalen Vorausetzungen sind erfüllt."
        icon={<CircleCheckIcon size="16" className="text-green-11 inline" />}
        className="mt-2"
      >
        <p>[TODO]</p>
      </CheckAccordionItem>

      <CheckAccordionItem
        value="mietspiegel"
        title={l({
          de: "Mietspiegel",
          en: "[DE]",
        })}
        subtitle={
          {
            Zulässig: l({
              de: "Die zulässige Höchstmiete ist nicht überschritten.",
              en: "[DE]",
            }),
            "Höchstmiete überschritten": l({
              de: "Die zulässige Höchstmiete ist überschritten.",
              en: "[DE]",
            }),
            "Höchstmiete eventuell überschritten": l({
              de: "Die zulässige Höchstmiete könnte überschritten sein.",
              en: "[DE]",
            }),
          }[result]
        }
        icon={
          {
            Zulässig: <CircleCheckIcon size="16" className="text-green-11" />,
            "Höchstmiete überschritten": (
              <CircleXIcon size="16" className="text-red-11" />
            ),
            "Höchstmiete eventuell überschritten": (
              <HelpCircleIcon size="16" className="text-gray-11" />
            ),
          }[result]
        }
      >
        <p>[TODO]</p>
      </CheckAccordionItem>

      <CheckAccordionItem
        value="kappungsgrenze"
        title="Kappungsgrenze"
        subtitle="Die Kappungsgrenze wird nicht überschritten."
        icon={<CircleCheckIcon size="16" className="text-green-11 inline" />}
      >
        <p>
          Vermieter dürfen in Berlin die Miete innerhalb von drei Jahren
          insgesamt um maximal 15 Prozent erhöhen. Dies ist die sogenannte
          Kappungsgrenze.
        </p>
        <p>[TODO]</p>
      </CheckAccordionItem>

      <CheckAccordionItem
        value="sperrfirst"
        title="Sperrfrist"
        subtitle="Die Sperrfrist wird eingehalten."
        icon={<CircleCheckIcon size="16" className="text-green-11 inline" />}
      >
        <p>[TODO]</p>
      </CheckAccordionItem>
    </Accordion>
  );
}
