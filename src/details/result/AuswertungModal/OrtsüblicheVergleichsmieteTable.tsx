import React from "react";

import { getLowestHighestOrtsueblicheVergleichsmiete } from "~/calculation/ortsueblicheVergleichsmiete";
import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import { getWorstBestSondermerkmalAbzugTotal } from "~/calculation/sondermerkmale";
import { getWorstBestSpanneneinordnungInPercent } from "~/calculation/spanneneinordnung";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { getMietspiegeljahr } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

const formatEuroWithSign = (value: number) =>
  (value > 0 ? "+" : "") + formatEuro(value);

export function OrtsüblicheVergleichsmieteTable() {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const preisspanne = getWorstBestPreisspanne(
    answers,
    visibleQuestionAliases,
  ) || {
    best: [0, 0, 0],
    worst: [0, 0, 0],
  };

  const spanneneinordung = getWorstBestSpanneneinordnungInPercent(
    answers,
    visibleQuestionAliases,
  );

  const sondermerkmalAbzug = getWorstBestSondermerkmalAbzugTotal(
    answers,
    visibleQuestionAliases,
  );

  const ortsueblicheVergleichsmiete =
    getLowestHighestOrtsueblicheVergleichsmiete(
      answers,
      visibleQuestionAliases,
    ) || {
      lowest: 0,
      highest: 0,
    };

  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);

  const rows = [
    {
      name: l("Mittelwert"),
      worst: l("pro-qm", {
        VALUE: formatEuro(preisspanne.worst[0]),
      }),
      best: l("pro-qm", { VALUE: formatEuro(preisspanne.best[0]) }),
    },
    {
      name: l("Merkmalsgruppen (in Prozent)"),
      worst: `${spanneneinordung.worst * 100}%`,
      best: `${spanneneinordung.best * 100}%`,
    },
    {
      name: l("Merkmalsgruppen (pro m²)"),
      worst: l("pro-qm", {
        VALUE: formatEuroWithSign(
          ortsueblicheVergleichsmiete.highest -
            preisspanne.worst[0] +
            sondermerkmalAbzug.worst,
        ),
      }),
      best: l("pro-qm", {
        VALUE: formatEuroWithSign(
          ortsueblicheVergleichsmiete.lowest -
            preisspanne.best[0] +
            sondermerkmalAbzug.best,
        ),
      }),
    },
    ...(mietspiegeljahr == "2015"
      ? [
          {
            name: l("Sondermerkmalabzug"),
            worst:
              sondermerkmalAbzug.best == 0
                ? formatEuro(0)
                : `-${formatEuro(sondermerkmalAbzug.best)}`,
            best:
              sondermerkmalAbzug.worst == 0
                ? formatEuro(0)
                : `-${formatEuro(sondermerkmalAbzug.worst)}`,
          },
        ]
      : []),
    {
      name: l("Ergebnis"),
      worst: l("pro-qm", {
        VALUE: formatEuro(ortsueblicheVergleichsmiete.highest),
      }),
      best: l("pro-qm", {
        VALUE: formatEuro(ortsueblicheVergleichsmiete.lowest),
      }),
    },
  ];

  if (
    ortsueblicheVergleichsmiete.lowest == ortsueblicheVergleichsmiete.highest
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
