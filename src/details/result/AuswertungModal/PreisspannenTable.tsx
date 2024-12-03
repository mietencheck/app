import React from "react";

import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

export function PreisspannenTable() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  const l = useLocalizeField();
  const { best: lowestPreisspanne, worst: highestPreisspanne } =
    getWorstBestPreisspanne(answers, visibleQuestionAliases) || {
      best: [0, 0, 0],
      worst: [0, 0, 0],
    };

  const rows = [
    {
      label: l("Unterwert"),
      worst: `${formatEuro(highestPreisspanne[1])} ${l("pro")} m²`,
      best: `${formatEuro(lowestPreisspanne[1])} ${l("pro")} m²`,
    },
    {
      label: l("Mittelwert"),
      worst: `${formatEuro(highestPreisspanne[0])} ${l("pro")} m²`,
      best: `${formatEuro(lowestPreisspanne[0])} ${l("pro")} m²`,
    },
    {
      label: l("Oberwert"),
      worst: `${formatEuro(highestPreisspanne[2] ?? 0)} ${l("pro")} m²`,
      best: `${formatEuro(lowestPreisspanne[2])} ${l("pro")} m²`,
    },
  ];

  if (
    highestPreisspanne[0] == lowestPreisspanne[0] &&
    highestPreisspanne[1] == lowestPreisspanne[1] &&
    highestPreisspanne[2] == lowestPreisspanne[2]
  ) {
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
            {l("Niedrigste Miete")}
          </TableHead>
          <TableHead className="hidden sm:table-cell w-40 text-right">
            {l("Höchste Miete")}
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
