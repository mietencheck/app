import React from "react";

import {
  getWorstBestMerkmalStateByMerkmalGrupppeInPercent,
  getWorstBestSpanneneinordnungInPercent,
} from "~/calculation/spanneneinordnung";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { answersToCalculationContext } from "~/form/calculation-context";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { MerkmalGruppe } from "~/mietspiegel/types";

export const Percent = ({ value }: { value: number }) => (
  <span>
    {value > 0 && "+"}
    {value * 100}%
  </span>
);

export function SpanneneinordungTable() {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const ctx = answersToCalculationContext(answers, visibleQuestionAliases);
  if (!ctx) {
    return null;
  }

  const { worst: worstSpanneneinordung, best: bestSpanneneinordung } =
    getWorstBestSpanneneinordnungInPercent(ctx);

  const worstBestMerkmalStateByGrupppeInPercent =
    getWorstBestMerkmalStateByMerkmalGrupppeInPercent(ctx);

  if (worstSpanneneinordung == bestSpanneneinordung) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{l("Merkmalsgruppe")}</TableHead>
            <TableHead className="w-40 text-right">{l("Wert")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(worstBestMerkmalStateByGrupppeInPercent).map(
            ([merkmaleGruppe, percent]) => {
              return (
                <TableRow key={merkmaleGruppe}>
                  <TableCell>{l(merkmaleGruppe as MerkmalGruppe)}</TableCell>
                  <TableCell className="w-40 text-right">
                    <Percent value={percent.best} />{" "}
                    {location.hash == "#debug" && (
                      <span className="text-neutral-faded">{percent.best}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            },
          )}
          <TableRow>
            <TableCell className="text-sm-medium">{l("Gesamt")}</TableCell>
            <TableCell className="w-40 text-right">
              <Percent value={bestSpanneneinordung} />
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
            {l("Niedrigste Miete")}
          </TableHead>
          <TableHead className="w-40 hidden sm:table-cell text-right">
            {l("Höchste Miete")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(worstBestMerkmalStateByGrupppeInPercent).map(
          ([merkmaleGruppe, percent]) => (
            <React.Fragment key={merkmaleGruppe}>
              <TableRow className="hidden sm:table-row">
                <TableCell>{l(merkmaleGruppe as MerkmalGruppe)}</TableCell>
                <TableCell className="w-40 text-right">
                  <Percent value={percent.best} />
                </TableCell>
                <TableCell className="w-40 text-right">
                  <Percent value={percent.worst} />
                </TableCell>
              </TableRow>
              <TableRow className="sm:hidden border-b-0">
                <TableCell colSpan={2} className="text-sm-medium pb-0">
                  {l(merkmaleGruppe as MerkmalGruppe)}
                </TableCell>
              </TableRow>
              <TableRow className="sm:hidden border-b-0">
                <TableCell className="text-neutral-faded pb-0">
                  {l("Niedrigste Miete")}
                </TableCell>
                <TableCell className="w-40 text-right pb-0">
                  <Percent value={percent.best} />
                </TableCell>
              </TableRow>
              <TableRow className="sm:hidden">
                <TableCell className="text-neutral-faded">
                  {l("Höchste Miete")}
                </TableCell>
                <TableCell className="w-40 text-right">
                  <Percent value={percent.worst} />
                </TableCell>
              </TableRow>
            </React.Fragment>
          ),
        )}

        <TableRow className="hidden sm:table-row">
          <TableCell className="text-sm-medium">{l("Gesamt")}</TableCell>
          <TableCell className="w-40 text-right">
            <Percent value={bestSpanneneinordung} />
          </TableCell>
          <TableCell className="w-40 text-right">
            <Percent value={worstSpanneneinordung} />
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden border-b-0">
          <TableCell colSpan={2} className="text-sm-medium pb-0">
            {l("Gesamt")}
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden border-b-0">
          <TableCell className="text-neutral-faded pb-0">
            {l("Niedrigste Miete")}
          </TableCell>
          <TableCell className="w-40 text-right pb-0">
            <Percent value={bestSpanneneinordung} />
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden">
          <TableCell className="text-neutral-faded">
            {l("Höchste Miete")}
          </TableCell>
          <TableCell className="w-40 text-right">
            <Percent value={worstSpanneneinordung} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
