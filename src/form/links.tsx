import type { DE } from "~/l10n";

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
