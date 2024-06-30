import React from "react";
import { firstBy } from "remeda";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { getWorstBestSpannenResults } from "~/form/rechner/MerkmalsGruppen";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

export function SpanneneinordnungTable() {
  const answers = useAnswers();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  const l = useLocalizeField();
  const spannenResults = getWorstBestSpannenResults(
    answers.getAliasedState(),
    visibleQuestionAliases,
  );

  // @Gregor das hier ist nicht richtig
  const worstSpanne = firstBy(spannenResults, [(s) => s.worstResult, "desc"]);
  const bestSpanne = firstBy(spannenResults, (s) => s.bestResult);

  const rows = [
    {
      label: l("Unterwert"),
      worst: `${formatEuro(worstSpanne?.min ?? 0)} ${l("pro")} m²`,
      best: `${formatEuro(bestSpanne?.min ?? 0)} ${l("pro")} m²`,
    },
    {
      label: l("Mittelwert"),
      worst: `${formatEuro(worstSpanne?.center ?? 0)} ${l("pro")} m²`,
      best: `${formatEuro(bestSpanne?.center ?? 0)} ${l("pro")} m²`,
    },
    {
      label: l("Oberwert"),
      worst: `${formatEuro(worstSpanne?.max ?? 0)} ${l("pro")} m²`,
      best: `${formatEuro(bestSpanne?.max ?? 0)} ${l("pro")} m²`,
    },
  ];

  if (worstSpanne == bestSpanne) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{l("Spanne")}</TableHead>
            <TableHead className="w-40 text-right">{l("Wert")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ label, best }) => (
            <React.Fragment key={label}>
              <TableRow>
                <TableCell>{label}</TableCell>
                <TableCell className="w-40 text-right">{best}</TableCell>
              </TableRow>
            </React.Fragment>
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
            ${l("Wert")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ label, worst, best }) => (
          <React.Fragment key={label}>
            <TableRow className="hidden sm:table-row">
              <TableCell>{label}</TableCell>
              <TableCell className="w-40 text-right">{best}</TableCell>
              <TableCell className="w-40 text-right">{worst}</TableCell>
            </TableRow>
            <TableRow className="sm:hidden border-b-0">
              <TableCell colSpan={2} className="text-sm-medium pb-0">
                {label}
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
