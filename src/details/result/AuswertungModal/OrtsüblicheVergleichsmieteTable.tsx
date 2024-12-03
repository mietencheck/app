import React from "react";

import { getLowestHighestOrtsueblicheVergleichsmiete } from "~/calculation/ortsueblicheVergleichsmiete";
import { getLowestHighestPreisspanne } from "~/calculation/preisspanne";
import { getLowestHighestSondermerkmalAbzugTotal } from "~/calculation/sondermerkmale";
import { getLowestHighestSpanneneinordnung } from "~/calculation/spanneneinordnung";
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

  const preisspanne = getLowestHighestPreisspanne(
    answers,
    visibleQuestionAliases,
  ) || {
    lowest: [0, 0, 0],
    highest: [0, 0, 0],
  };

  const spanneneinordung = getLowestHighestSpanneneinordnung(
    answers,
    visibleQuestionAliases,
  );

  const sondermerkmalAbzug = getLowestHighestSondermerkmalAbzugTotal(
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
      highest: l("pro-qm", {
        VALUE: formatEuro(preisspanne.highest[0]),
      }),
      lowest: l("pro-qm", { VALUE: formatEuro(preisspanne.lowest[0]) }),
    },
    {
      name: l("Merkmalsgruppen (in Prozent)"),
      highest: `${spanneneinordung.highest * 100}%`,
      lowest: `${spanneneinordung.lowest * 100}%`,
    },
    {
      name: l("Merkmalsgruppen (pro m²)"),
      highest: l("pro-qm", {
        VALUE: formatEuroWithSign(
          ortsueblicheVergleichsmiete.highest -
            preisspanne.highest[0] +
            sondermerkmalAbzug.lowest,
        ),
      }),
      lowest: l("pro-qm", {
        VALUE: formatEuroWithSign(
          ortsueblicheVergleichsmiete.lowest -
            preisspanne.lowest[0] +
            sondermerkmalAbzug.highest,
        ),
      }),
    },
    ...(mietspiegeljahr == "2015"
      ? [
          {
            name: l("Sondermerkmalabzug"),
            highest:
              sondermerkmalAbzug.lowest == 0
                ? formatEuro(0)
                : `-${formatEuro(sondermerkmalAbzug.lowest)}`,
            lowest:
              sondermerkmalAbzug.highest == 0
                ? formatEuro(0)
                : `-${formatEuro(sondermerkmalAbzug.highest)}`,
          },
        ]
      : []),
    {
      name: l("Ergebnis"),
      highest: l("pro-qm", {
        VALUE: formatEuro(ortsueblicheVergleichsmiete.highest),
      }),
      lowest: l("pro-qm", {
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
          {rows.map(({ name, highest }) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell className="w-40 text-right">{highest}</TableCell>
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
        {rows.map(({ name, highest, lowest }) => (
          <React.Fragment key={name}>
            <TableRow className="hidden sm:table-row">
              <TableCell>{name}</TableCell>
              <TableCell className="w-40 text-right">{lowest}</TableCell>
              <TableCell className="w-40 text-right">{highest}</TableCell>
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
              <TableCell className="w-40 text-right pb-0">{lowest}</TableCell>
            </TableRow>
            <TableRow className="sm:hidden">
              <TableCell className="text-neutral-faded">
                {l("Höchste Miete")}
              </TableCell>
              <TableCell className="w-40 text-right">{highest}</TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
