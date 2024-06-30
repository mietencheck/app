import React from "react";
import { firstBy } from "remeda";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import {
  getMietspiegelJahr,
  useAnswers,
  useVisibleQuestionAliases,
} from "~/form/flow-machine";
import {
  getWorstBestMerkmalsgruppen,
  getWorstBestMerkmalsGruppenInProzent,
  getWorstBestSpannenResults,
} from "~/form/rechner/MerkmalsGruppen";
import { getWorstBestOrtsüblicheVergleichsmiete } from "~/form/rechner/Miete";
import { getWorstBestSondermerkmale } from "~/form/rechner/Sondermerkmale";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

import { getWorstBestSondermerkmalZuschläge } from "./utils";

const formatEuroWithSign = (value: number) =>
  (value > 0 ? "+" : "") + formatEuro(value);

export function OrtsüblicheVergleichsmieteTable() {
  const l = useLocalizeField();
  const answers = useAnswers();
  const aliasedAnswers = answers.getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const spannenResults = getWorstBestSpannenResults(
    answers.getAliasedState(),
    visibleQuestionAliases,
  );
  const worstSpanne = firstBy(spannenResults, [(s) => s.worstResult, "desc"]);
  const bestSpanne = firstBy(spannenResults, (s) => s.bestResult);
  const { worst: merkmalProzentWorst, best: merkmalProzentBest } =
    getWorstBestMerkmalsGruppenInProzent(
      aliasedAnswers,
      visibleQuestionAliases,
    );
  const { worst: merkmalWorst, best: merkmalBest } =
    getWorstBestMerkmalsgruppen(aliasedAnswers, visibleQuestionAliases) ?? {
      worst: 0,
      best: 0,
    };
  const sondermerkmale = getWorstBestSondermerkmalZuschläge(
    aliasedAnswers,
    visibleQuestionAliases,
  );
  const sondermerkmaleTotal = getWorstBestSondermerkmale(sondermerkmale);

  const vergleichsmiete = getWorstBestOrtsüblicheVergleichsmiete(
    aliasedAnswers,
    visibleQuestionAliases,
  ) ?? { worst: 0, best: 0 };

  const jahr = getMietspiegelJahr(answers.getWithOptionAlias("Vertragsdatum"));

  const rows = [
    {
      name: l("Mittelwert"),
      worst: l("pro-qm", { VALUE: formatEuro(worstSpanne?.center ?? 0) }),
      best: l("pro-qm", { VALUE: formatEuro(bestSpanne?.center ?? 0) }),
    },
    {
      name: l("Merkmalsgruppen (in Prozent)"),
      worst: `${merkmalProzentWorst > 0 ? "+" : ""}${Math.round(merkmalProzentWorst * 100)}%`,
      best: `${merkmalProzentBest > 0 ? "+" : ""}${Math.round(merkmalProzentBest * 100)}%`,
    },
    {
      name: l("Merkmalsgruppen (pro m²)"),
      worst: l("pro-qm", { VALUE: formatEuroWithSign(merkmalWorst) }),
      best: l("pro-qm", { VALUE: formatEuroWithSign(merkmalBest) }),
    },
    ...(jahr == "2015"
      ? [
          {
            name: l("Sondermerkmale"),
            worst: `${formatEuro(sondermerkmaleTotal.worst)}`,
            best: `${formatEuro(sondermerkmaleTotal.best)}`,
          },
        ]
      : []),
    {
      name: l("Ergebnis"),
      worst: l("pro-qm", { VALUE: formatEuro(vergleichsmiete.worst) }),
      best: l("pro-qm", { VALUE: formatEuro(vergleichsmiete.best) }),
    },
  ];

  if (formatEuro(vergleichsmiete.worst) == formatEuro(vergleichsmiete.best)) {
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
