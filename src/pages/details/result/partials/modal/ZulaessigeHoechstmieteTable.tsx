import React from "react";

import { getWorstBestOrtsueblicheVergleichsmiete } from "~/calculation/ortsueblicheVergleichsmiete";
import { getWorstBestZulaessigeHoechstmiete } from "~/calculation/zulaessigeHoechstmiete";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { getWohnflaeche } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

export function ZulaessigeHoechstmieteTable() {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const { worst: worstVergleichsmietePerQm, best: bestVergleichsmietePerQm } =
    getWorstBestOrtsueblicheVergleichsmiete(
      answers,
      visibleQuestionAliases,
    ) ?? {
      worst: 0,
      best: 0,
    };

  const { best: bestHöchstmiete, worst: worstHöchstmiete } =
    getWorstBestZulaessigeHoechstmiete(answers, visibleQuestionAliases) ?? {
      best: 0,
      worst: 0,
    };

  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);

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
      best: l("pro-qm", {
        VALUE: formatEuro(bestVergleichsmietePerQm * 0.1),
      }),
    },
    {
      name: l("Wohnfläche"),
      worst: `${wohnflaeche}m²`,
      best: `${wohnflaeche}m²`,
    },
    {
      name: l("Zulässige Höchstmiete"),
      worst: l("pro-qm", { VALUE: formatEuro(worstHöchstmiete) }),
      best: l("pro-qm", { VALUE: formatEuro(bestHöchstmiete) }),
    },
  ];

  if (formatEuro(bestHöchstmiete) == formatEuro(worstHöchstmiete)) {
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
            {l("Niedrigste Miete")}
          </TableHead>
          <TableHead className="hidden sm:table-cell w-40 text-right">
            {l("Höchste Miete")}
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
                {l("Niedrigste Miete")}
              </TableCell>
              <TableCell className="w-40 text-right pb-0">{best}</TableCell>
            </TableRow>
            <TableRow className="sm:hidden">
              <TableCell className="text-neutral-faded">
                {l("Höchste Miete")}
              </TableCell>
              <TableCell className="w-40 text-right">{worst}</TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
