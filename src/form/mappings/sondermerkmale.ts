import { Sondermerkmal } from "~/mietspiegel/types";

import { Condition, ConditionGroup } from "./merkmale";

export const answersToSondermerkmalStateMapping = {
  "[Sondermerkmal] Hochwertiger Bodenbelag": {
    checked_if: { "Sondermerkmal Bodenbelag": "Ja" },
  },
  "[Sondermerkmal] Moderne Küchenausstattung": {
    checked_if: { "Sondermerkmal Moderne Küche": "Ja" },
  },
  "[Sondermerkmal] Von der Badewanne getrennte Dusche": {
    checked_if: { "Sondermerkmal Dusche Und Badewanne": "Ja" },
  },
  "[Sondermerkmal] Kleines Bad": {
    checked_if: { "Sondermerkmal Badezimmer Klein": "Nein" },
  },
  "[Sondermerkmal] Modernes Bad": {
    checked_if: { "Sondermerkmal Modernes Bad": "Ja" },
  },
  "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": {
    checked_if: { "Sondermerkmal Schallschutzfenster": "Ja" },
  },
  "[Sondermerkmal] Aufzug im Haus": {
    checked_if: { "Sondermerkmal Aufzug": "Ja" },
  },
} satisfies {
  [key in Sondermerkmal]: {
    checked_if: ConditionGroup | Condition;
  };
};
