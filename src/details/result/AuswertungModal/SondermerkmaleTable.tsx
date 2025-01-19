import React from "react";

import {
  getWorstBestSondermerkmalModifier,
  getWorstBestSondermerkmalModifierBySondermerkmal,
} from "~/calculation/sondermerkmale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { getSondermerkmalStates } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField, useLocalizeString } from "~/l10n";
import { sondermerkmale } from "~/mietspiegel/sondermerkmale";
import { Sondermerkmal } from "~/mietspiegel/types";
import { formatEuro } from "~/utils";

export function SondermerkmaleTable() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const lField = useLocalizeField();
  const lString = useLocalizeString();

  const aufschlagBySondermerkmal =
    getWorstBestSondermerkmalModifierBySondermerkmal(
      answers,
      visibleQuestionAliases,
    );
  const sondermerkmalAufschlag = getWorstBestSondermerkmalModifier(
    answers,
    visibleQuestionAliases,
  );
  const sondermerkmalState = getSondermerkmalStates(
    answers,
    visibleQuestionAliases,
  );

  if (!aufschlagBySondermerkmal) {
    return;
  }

  if (sondermerkmalAufschlag.best == sondermerkmalAufschlag.worst) {
    return (
      <div className="flex flex-col">
        <h2 className="heading-20 mb-6">{lString("Sondermerkmale")}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{lField("Spanne")}</TableHead>
              <TableHead className="w-32 text-right">
                {lField("Antwort")}
              </TableHead>
              <TableHead className="w-40 text-right">
                {lField("Wert")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(aufschlagBySondermerkmal).map(
              ([sondermerkmal, abzug]) => {
                const answer =
                  sondermerkmalState?.[sondermerkmal as Sondermerkmal] ?? "";

                return (
                  <React.Fragment key={sondermerkmal}>
                    <TableRow>
                      <TableCell>
                        {sondermerkmale[sondermerkmal as Sondermerkmal]}
                      </TableCell>
                      <TableCell className="w-32 text-right">
                        {answer == "checked"
                          ? lString("Ja")
                          : answer == "unchecked"
                            ? lString("Nein")
                            : lString("Vielleicht")}
                      </TableCell>
                      <TableCell className="w-40 text-right">
                        {formatEuro(abzug.best)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              },
            )}
            <TableRow className="hidden sm:table-row print:table-row">
              <TableCell colSpan={2} className="text-sm-book">
                {lField("Ergebnis")}
              </TableCell>
              <TableCell className="w-32 text-right text-sm-book">
                {formatEuro(sondermerkmalAufschlag.best)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="heading-20 mb-6">{lString("Sondermerkmale")}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{lField("Spanne")}</TableHead>
            <TableHead className="hidden sm:table-cell print:table-cell w-24 text-right">
              {lField("Antwort")}
            </TableHead>
            <TableHead className="hidden sm:table-cell print:table-cell w-32 text-right">
              {lField("Niedrigste Miete")}
            </TableHead>
            <TableHead className="hidden sm:table-cell print:table-cell w-36 text-right">
              {lField("Höchste Miete")}
            </TableHead>
            <TableHead className="sm:hidden print:hidden w-40 text-right">
              {lField("Wert")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(aufschlagBySondermerkmal).map(
            ([sondermerkmal, abzug]) => {
              const answer =
                sondermerkmalState?.[sondermerkmal as Sondermerkmal] ?? "";

              return (
                <React.Fragment key={sondermerkmal}>
                  <TableRow className="hidden sm:table-row print:table-row">
                    <TableCell>
                      {sondermerkmale[sondermerkmal as Sondermerkmal]}
                    </TableCell>
                    <TableCell className="w-32 text-right">
                      {answer == "checked"
                        ? lString("Ja")
                        : answer == "unchecked"
                          ? lString("Nein")
                          : lString("Vielleicht")}
                    </TableCell>
                    <TableCell className="w-40 text-right">
                      {formatEuro(abzug.best)}
                    </TableCell>
                    <TableCell className="w-32 text-right">
                      {formatEuro(abzug.worst)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="sm:hidden print:hidden border-b-0">
                    <TableCell colSpan={2} className="text-sm-medium pb-0">
                      {sondermerkmal}
                    </TableCell>
                  </TableRow>
                  <TableRow className="sm:hidden print:hidden border-b-0">
                    <TableCell className="text-neutral-faded pb-0">
                      {lField("Niedrigste Miete")}
                    </TableCell>
                    <TableCell className="w-40 text-right pb-0">
                      {formatEuro(abzug.best)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="sm:hidden print:hidden">
                    <TableCell className="text-neutral-faded ">
                      {lField("Höchste Miete")}
                    </TableCell>
                    <TableCell className="w-40 text-right">
                      {formatEuro(abzug.worst)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            },
          )}
          <TableRow className="hidden sm:table-row print:table-row">
            <TableCell colSpan={2} className="text-sm-book">
              {lField("Ergebnis")}
            </TableCell>
            <TableCell className="w-40 text-right text-sm-book">
              {formatEuro(sondermerkmalAufschlag.best)}
            </TableCell>
            <TableCell className="w-32 text-right text-sm-book">
              {formatEuro(sondermerkmalAufschlag.worst)}
            </TableCell>
          </TableRow>
          <TableRow className="sm:hidden print:hidden border-b-0">
            <TableCell colSpan={2} className="text-sm-medium pb-0">
              {lField("Ergebnis")}
            </TableCell>
          </TableRow>
          <TableRow className="sm:hidden print:hidden">
            <TableCell className="text-neutral-faded">
              {lField("Niedrigste Miete")}
            </TableCell>
            <TableCell className="w-40 text-right text-sm-book">
              {formatEuro(sondermerkmalAufschlag.best)}
            </TableCell>
          </TableRow>
          <TableRow className="sm:hidden print:hidden border-b-0">
            <TableCell className="text-neutral-faded pb-0">
              {lField("Höchste Miete")}
            </TableCell>
            <TableCell className="w-40 text-right pb-0 text-sm-book">
              {formatEuro(sondermerkmalAufschlag.worst)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
