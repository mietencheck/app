import React from "react";
import { entries } from "remeda";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import {
  getMerkmalGruppeSpannen,
  getWorstBestMerkmalsGruppenInProzent,
} from "~/form/rechner/MerkmalsGruppen";
import { useLocalizeField } from "~/l10n";

const Perc = ({ value }: { value: number }) => (
  <span>
    {value > 0 && "+"}
    {value == 0 ? 0 : value < 0 ? -20 : 20}%
  </span>
);

export function MerkmalsGruppenTable() {
  const answers = useAnswers();
  const aliasedAnswers = answers.getAliasedState();
  const visibleQuestionAlises = useVisibleQuestionAliases();
  const spannen = getMerkmalGruppeSpannen(
    answers.getAliasedState(),
    visibleQuestionAlises,
  );
  const l = useLocalizeField();

  const rows = entries
    .strict(spannen)
    .map(([name, [worstMerkmale, bestMerkmale]]) => ({
      name,
      worstMerkmale,
      bestMerkmale,
    }));

  const { worst: worstPercTotal, best: bestPercTotal } =
    getWorstBestMerkmalsGruppenInProzent(aliasedAnswers, visibleQuestionAlises);

  if (worstPercTotal == bestPercTotal) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{l("Merkmalsgruppe")}</TableHead>
            <TableHead className="w-40 text-right">{l("Wert")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ name, bestMerkmale }) => {
            return (
              <TableRow key={name}>
                <TableCell>{l(name)}</TableCell>
                <TableCell className="w-40 text-right">
                  <Perc value={bestMerkmale} />{" "}
                  {location.hash == "#debug" && (
                    <span className="text-neutral-faded">{bestMerkmale}</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell className="text-sm-medium">{l("Gesamt")}</TableCell>
            <TableCell className="w-40 text-right">
              {Math.round(bestPercTotal * 100)}%
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{l("Merkmalsgruppe")}</TableHead>
          <TableHead className="w-40 hidden sm:table-cell text-right">
            {l("Bester Fall")}
          </TableHead>
          <TableHead className="w-40 hidden sm:table-cell text-right">
            {l("Schlechtester Fall")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ name, worstMerkmale, bestMerkmale }) => {
          const best = (
            <>
              <Perc value={bestMerkmale} />{" "}
              {location.hash == "#debug" && (
                <span className="text-neutral-faded">{bestMerkmale}</span>
              )}
            </>
          );
          const worst = (
            <>
              <Perc value={worstMerkmale} />{" "}
              {location.hash == "#debug" && (
                <span className="text-neutral-faded">{worstMerkmale}</span>
              )}
            </>
          );

          return (
            <React.Fragment key={name}>
              <TableRow className="hidden sm:table-row">
                <TableCell>{l(name)}</TableCell>
                <TableCell className="w-40 text-right">{best}</TableCell>
                <TableCell className="w-40 text-right">{worst}</TableCell>
              </TableRow>
              <TableRow className="sm:hidden border-b-0">
                <TableCell colSpan={2} className="text-sm-medium pb-0">
                  {l(name)}
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
          );
        })}

        <TableRow className="hidden sm:table-row">
          <TableCell className="text-sm-medium">{l("Gesamt")}</TableCell>
          <TableCell className="w-40 text-right">
            {Math.round(bestPercTotal * 100)}%
          </TableCell>
          <TableCell className="w-40 text-right">
            {Math.round(worstPercTotal * 100)}%
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden border-b-0">
          <TableCell colSpan={2} className="text-sm-medium pb-0">
            {l("Gesamt")}
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden border-b-0">
          <TableCell className="text-neutral-faded pb-0">
            {l("Bester Fall")}
          </TableCell>
          <TableCell className="w-40 text-right pb-0">
            {Math.round(bestPercTotal * 100)}%
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden">
          <TableCell className="text-neutral-faded">
            {l("Schlechtester Fall")}
          </TableCell>
          <TableCell className="w-40 text-right">
            {Math.round(worstPercTotal * 100)}%
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
