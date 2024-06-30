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
import { getWorstBestSondermerkmale } from "~/form/rechner/Sondermerkmale";
import { useLocalizeField, useLocalizeString } from "~/l10n";
import { formatEuro } from "~/utils";

import { getWorstBestSondermerkmalZuschläge } from "./utils";

export function SondermerkmaleTable() {
  const answers = useAnswers();
  const aliasedAnswers = answers.getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  const lField = useLocalizeField();
  const lString = useLocalizeString();

  const merkmale = getWorstBestSondermerkmalZuschläge(
    aliasedAnswers,
    visibleQuestionAliases,
  );
  const total = getWorstBestSondermerkmale(merkmale);

  if (total.worst == total.best) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{lField("Spanne")}</TableHead>
            <TableHead className="w-32 text-right">
              {lField("Antwort")}
            </TableHead>
            <TableHead className="w-40 text-right">{lField("Wert")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merkmale.map(({ labelKey, answer, best }) => (
            <React.Fragment key={labelKey}>
              <TableRow>
                <TableCell>{lField(labelKey)}</TableCell>
                <TableCell className="w-32 text-right">
                  {answer == "Vielleicht"
                    ? lField("Vielleicht")
                    : lString(answer)}
                </TableCell>
                <TableCell className="w-40 text-right">
                  {formatEuro(best)}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          <TableRow className="hidden sm:table-row print:table-row">
            <TableCell colSpan={2} className="text-sm-book">
              {lField("Ergebnis")}
            </TableCell>
            <TableCell className="w-32 text-right text-sm-book">
              {formatEuro(total.best)}
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
          <TableHead>{lField("Spanne")}</TableHead>
          <TableHead className="hidden sm:table-cell print:table-cell w-32 text-right">
            {lField("Antwort")}
          </TableHead>
          <TableHead className="hidden sm:table-cell print:table-cell w-32 text-right">
            {lField("Bester Fall")}
          </TableHead>
          <TableHead className="hidden sm:table-cell print:table-cell w-40 text-right">
            {lField("Schlechtester Fall")}
          </TableHead>
          <TableHead className="sm:hidden print:hidden w-40 text-right">
            {lField("Wert")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {merkmale.map(({ labelKey, answer, worst, best }) => (
          <React.Fragment key={labelKey}>
            <TableRow className="hidden sm:table-row print:table-row">
              <TableCell>{lField(labelKey)}</TableCell>
              <TableCell className="w-32 text-right">
                {answer == "Vielleicht"
                  ? lField("Vielleicht")
                  : lString(answer)}
              </TableCell>
              <TableCell className="w-32 text-right">
                {formatEuro(best)}
              </TableCell>
              <TableCell className="w-40 text-right">
                {formatEuro(worst)}
              </TableCell>
            </TableRow>
            <TableRow className="sm:hidden print:hidden border-b-0">
              <TableCell colSpan={2} className="text-sm-medium pb-0">
                {lField(labelKey)}
              </TableCell>
            </TableRow>
            <TableRow className="sm:hidden print:hidden border-b-0">
              <TableCell className="text-neutral-faded pb-0">
                {lField("Bester Fall")}
              </TableCell>
              <TableCell className="w-40 text-right pb-0">
                {formatEuro(best)}
              </TableCell>
            </TableRow>
            <TableRow className="sm:hidden print:hidden">
              <TableCell className="text-neutral-faded">
                {lField("Schlechtester Fall")}
              </TableCell>
              <TableCell className="w-40 text-right">
                {formatEuro(worst)}
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
        <TableRow className="hidden sm:table-row print:table-row">
          <TableCell colSpan={2} className="text-sm-book">
            {lField("Ergebnis")}
          </TableCell>
          <TableCell className="w-32 text-right text-sm-book">
            {formatEuro(total.best)}
          </TableCell>
          <TableCell className="w-40 text-right text-sm-book">
            {formatEuro(total.worst)}
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden print:hidden border-b-0">
          <TableCell colSpan={2} className="text-sm-medium pb-0">
            {lField("Ergebnis")}
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden print:hidden border-b-0">
          <TableCell className="text-neutral-faded pb-0">
            {lField("Bester Fall")}
          </TableCell>
          <TableCell className="w-40 text-right pb-0 text-sm-book">
            {formatEuro(total.best)}
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden print:hidden">
          <TableCell className="text-neutral-faded">
            {lField("Schlechtester Fall")}
          </TableCell>
          <TableCell className="w-40 text-right text-sm-book">
            {formatEuro(total.worst)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
