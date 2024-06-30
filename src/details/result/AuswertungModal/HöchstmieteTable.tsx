import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import {
  getWorstBestOrtsüblicheVergleichsmiete,
  getWorstBestZulässigeHöchstmiete,
} from "~/form/rechner/Miete";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

export function HöchstmieteTable() {
  const l = useLocalizeField();
  const answers = useAnswers();
  const aliasedAnswers = answers.getAliasedState();
  const visibleQuestionAlises = useVisibleQuestionAliases();

  const { worst: worstVergleichsmietePerQm, best: bestVergleichsmietePerQm } =
    getWorstBestOrtsüblicheVergleichsmiete(
      aliasedAnswers,
      visibleQuestionAlises,
    ) ?? { worst: 0, best: 0 };

  const { worst: worstHöchstmiete, best: bestHöchstmiete } =
    getWorstBestZulässigeHöchstmiete(aliasedAnswers, visibleQuestionAlises) ?? {
      worst: 0,
      best: 0,
    };

  const qm = Number(answers.get("Qm"));

  const rows = [
    {
      name: l("Ortsübliche Vergleichsmiete"),
      worst: l("pro-qm", { VALUE: formatEuro(worstVergleichsmietePerQm) }),
      best: l("pro-qm", { VALUE: formatEuro(bestVergleichsmietePerQm) }),
    },
    {
      name: l("10% Aufschlag"),
      worst: l("pro-qm", {
        VALUE: formatEuro(worstVergleichsmietePerQm * 0.1),
      }),
      best: l("pro-qm", { VALUE: formatEuro(bestVergleichsmietePerQm * 0.1) }),
    },
    {
      name: l("Wohnfläche"),
      worst: `${qm}m²`,
      best: `${qm}m²`,
    },
    {
      name: l("Zulässige Höchstmiete"),
      worst: l("pro-qm", { VALUE: formatEuro(worstHöchstmiete) }),
      best: l("pro-qm", { VALUE: formatEuro(bestHöchstmiete) }),
    },
  ];

  if (formatEuro(worstHöchstmiete) == formatEuro(bestHöchstmiete)) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{l("Spanne")}</TableHead>
            <TableHead className="w-40 text-right">{l("Wert")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ name, best }) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell className="w-40 text-right">{best}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{l("Spanne")}</TableHead>
          <TableHead className="hidden sm:table-cell w-40 text-right">
            {l("Bester Fall")}
          </TableHead>
          <TableHead className="hidden sm:table-cell w-40 text-right">
            {l("Schlechtester Fall")}
          </TableHead>
          <TableHead className="sm:hidden w-40 text-right">
            {l("Wert")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ name, worst, best }) => (
          <React.Fragment key={name}>
            <TableRow className="hidden sm:table-row">
              <TableCell>{name}</TableCell>
              <TableCell className="w-40 text-right">{best}</TableCell>
              <TableCell className="w-40 text-right">{worst}</TableCell>
            </TableRow>
            <TableRow className="sm:hidden border-b-0">
              <TableCell colSpan={2} className="text-sm-medium pb-0">
                {name}
              </TableCell>
            </TableRow>
            <TableRow className="sm:hidden border-b-0">
              <TableCell className="text-neutral-faded pb-0">
                {l("Bester Fall")}
              </TableCell>
              <TableCell className="w-40 text-right pb-0">{best}</TableCell>
            </TableRow>
            <TableRow className="sm:hidden">
              <TableCell className="text-neutral-faded">
                {l("Schlechtester Fall")}
              </TableCell>
              <TableCell className="w-40 text-right">{worst}</TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
