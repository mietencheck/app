import React from "react";

import {
  calcMerkmalsgruppenValueInEuro,
  getWorstBestOrtsueblicheVergleichsmiete,
} from "~/calculation/ortsueblicheVergleichsmiete";
import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import { getWorstBestSondermerkmalModifier } from "~/calculation/sondermerkmale";
import { getWorstBestSpanneneinordnungInPercent } from "~/calculation/spanneneinordnung";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { getMietspiegeljahr } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

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

  const sondermerkmalAufschlag = getWorstBestSondermerkmalModifier(
    answers,
    visibleQuestionAliases,
  );

  const merkmalsgruppenInEuro = {
    worst: calcMerkmalsgruppenValueInEuro(
      preisspanne.worst,
      spanneneinordung.worst,
      sondermerkmalAufschlag.worst,
    ),
    best: calcMerkmalsgruppenValueInEuro(
      preisspanne.best,
      spanneneinordung.best,
      sondermerkmalAufschlag.best,
    ),
  };

  const ortsueblicheVergleichsmiete = getWorstBestOrtsueblicheVergleichsmiete(
    answers,
    visibleQuestionAliases,
  ) || {
    best: 0,
    worst: 0,
  };

  const [avg, _, upper] = preisspanne.worst;
  const merkmalsgruppenValueIsLimited =
    ortsueblicheVergleichsmiete.worst >= upper &&
    merkmalsgruppenInEuro.worst !== upper - avg;

  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);

  const rows = [
    {
      name: l("Mittelwert"),
      worst: l("pro-qm", {
        VALUE: formatEuro(preisspanne.worst[0]),
      }),
      best: l("pro-qm", { VALUE: formatEuro(preisspanne.best[0]) }),
    },
    ...(mietspiegeljahr == "2015"
      ? [
          {
            name: l("Sondermerkmal Aufschlag"),
            worst:
              sondermerkmalAufschlag.best == 0
                ? formatEuro(0)
                : formatEuro(sondermerkmalAufschlag.worst),
            best:
              sondermerkmalAufschlag.worst == 0
                ? formatEuro(0)
                : formatEuro(sondermerkmalAufschlag.best),
          },
        ]
      : []),
    {
      name: l("Merkmalsgruppen (in Prozent)"),
      worst: `${spanneneinordung.worst * 100}%`,
      best: `${spanneneinordung.best * 100}%`,
    },
    {
      name: l("Merkmalsgruppen (pro m²)"),
      worst: l("pro-qm", {
        VALUE: `${formatEuro(merkmalsgruppenInEuro.worst)} ${merkmalsgruppenValueIsLimited ? "*" : ""}`,
      }),
      best: l("pro-qm", {
        VALUE: formatEuro(merkmalsgruppenInEuro.best),
      }),
    },
    {
      name: l("Ergebnis"),
      worst: l("pro-qm", {
        VALUE: formatEuro(ortsueblicheVergleichsmiete.worst),
      }),
      best: l("pro-qm", {
        VALUE: formatEuro(ortsueblicheVergleichsmiete.best),
      }),
    },
  ];

  if (ortsueblicheVergleichsmiete.best == ortsueblicheVergleichsmiete.worst) {
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
    <>
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
      {merkmalsgruppenValueIsLimited && (
        <div className="mt-4">
          <p className="text-sm text-gray-11">
            * Der Aufschlag der Merkmalsgruppen darf in diesem Fall nicht
            komplett angerechnet werden.
          </p>
        </div>
      )}
    </>
  );
}
