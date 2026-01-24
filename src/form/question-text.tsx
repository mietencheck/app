import type { DE } from "~/l10n";

import { useAnswers } from "./flow-machine";
import { StepInfoByAlias } from "./flow.fm";

export const questionTextLinks: Partial<
  Record<keyof StepInfoByAlias, Partial<Record<keyof typeof DE, string>>>
> = {
  "Bad mit Strukturheizkörper": {
    "image-link:Bad mit Strukturheizkörper": "/images/strukturheizkoerper.png",
  },
  "Bad hat wandhängendes WC": {
    "image-link:Bad hat wandhängendes WC": "/images/wandhaengendes-wc.png",
  },
  "Bad hat Einhebelmischbatterie": {
    "image-link:Bad hat Einhebelmischbatterie":
      "/images/einhebelmischbatterie.jpg",
  },
};

export const questionTextVars: Partial<
  Record<
    keyof StepInfoByAlias,
    Record<string, (answers: ReturnType<typeof useAnswers>) => string>
  >
> = {
  "Mieterhöhung innerhalb der letzten 15 Monaten": {
    DATUM_MIETERHOEHUNG_MINUS_15_MONATE: (a) => {
      const date = new Date(a.get(["Datum Mieterhöhungsschreiben"]) as string);
      date.setMonth(date.getMonth() - 15);
      return date.toLocaleDateString("de-DE");
    },
  },
  "Mieterhöhung in letzten 33 Monaten": {
    DATUM_MIETERHOEHUNG_MINUS_33_MONATE: (a) => {
      const date = new Date(a.get(["Datum Mieterhöhungsschreiben"]) as string);
      date.setMonth(date.getMonth() - 33);
      return date.toLocaleDateString("de-DE");
    },
  },
  "Kappungsgrenze überschritten": {
    DATUM_MIETERHOEHUNG_MINUS_33_MONATE: (a) => {
      const date = new Date(a.get(["Datum Mieterhöhungsschreiben"]) as string);
      date.setMonth(date.getMonth() - 33);
      return date.toLocaleDateString("de-DE");
    },
  },
};
