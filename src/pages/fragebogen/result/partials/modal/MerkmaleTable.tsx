import React from "react";

import { getWorstBestMerkmalStateByMerkmalGruppe } from "~/calculation/spanneneinordnung";
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

export function MerkmaleTable() {
  const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const ctx = answersToCalculationContext(answers, visibleQuestionAliases);
  if (!ctx) {
    return null;
  }
  const merkmalStatesByGruppe = ctx.merkmale;
  const merkmalStateTotalByGruppe =
    getWorstBestMerkmalStateByMerkmalGruppe(ctx);

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(merkmalStatesByGruppe).flatMap(
        ([merkmalGruppe, { Wohnwerterhoehend, Wohnwertmindernd }]) => {
          return (
            <div className="" key={merkmalGruppe}>
              <h2 className="heading-20 mb-6">{merkmalGruppe}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Merkmal</TableHead>
                    <TableHead className="hidden sm:table-cell w-28 text-right">
                      Antwort
                    </TableHead>
                    <TableHead className="hidden sm:table-cell w-36 text-right">
                      {l("Niedrigste Miete")}
                    </TableHead>
                    <TableHead className="hidden sm:table-cell w-28 text-right">
                      {l("Höchste Miete")}
                    </TableHead>
                    <TableHead className="sm:hidden w-36 text-right">
                      {l("Wert")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(
                    [
                      [Wohnwerterhoehend, "+"],
                      [Wohnwertmindernd, "-"],
                    ] as const
                  ).map(([fields, sign]) =>
                    Object.entries(fields).map(([merkmal, state]) => {
                      const label = merkmal;
                      const antwort =
                        state &&
                        {
                          checked: "Ja",
                          unchecked: "Nein",
                          maybe: "Vielleicht",
                        }[state];
                      const best =
                        state == "maybe"
                          ? sign == "+"
                            ? `0`
                            : `-1`
                          : state == "unchecked"
                            ? "0"
                            : `${sign}1`;
                      const worst =
                        state == "maybe"
                          ? sign == "+"
                            ? `+1`
                            : `0`
                          : state == "unchecked"
                            ? "0"
                            : `${sign}1`;

                      return (
                        <React.Fragment key={label}>
                          <TableRow className="hidden sm:table-row">
                            <TableCell>{label}</TableCell>
                            <TableCell className="w-28 text-right">
                              {antwort}
                            </TableCell>
                            <TableCell className="w-28 text-right">
                              {best}
                            </TableCell>
                            <TableCell className="w-36 text-right">
                              {worst}
                            </TableCell>
                          </TableRow>
                          <TableRow className="sm:hidden border-b-0">
                            <TableCell
                              colSpan={2}
                              className="text-sm-medium pb-0"
                            >
                              {label}
                            </TableCell>
                          </TableRow>
                          <TableRow className="sm:hidden border-b-0">
                            <TableCell className="text-gray-11 pb-0">
                              {l("Niedrigste Miete")}
                            </TableCell>
                            <TableCell className="w-36 text-right pb-0">
                              {best}
                            </TableCell>
                          </TableRow>
                          <TableRow className="sm:hidden">
                            <TableCell className="text-gray-11">
                              {l("Höchste Miete")}
                            </TableCell>
                            <TableCell className="w-36 text-right">
                              {worst}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    }),
                  )}
                  <TableRow className="hidden sm:table-row">
                    <TableCell colSpan={2} className="text-sm-medium">
                      Summe
                    </TableCell>
                    <TableCell className="w-28 text-right">
                      {
                        merkmalStateTotalByGruppe[
                          merkmalGruppe as MerkmalGruppe
                        ].worst
                      }
                    </TableCell>
                    <TableCell className="w-36 text-right">
                      {
                        merkmalStateTotalByGruppe[
                          merkmalGruppe as MerkmalGruppe
                        ].best
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow className="sm:hidden border-b-0">
                    <TableCell colSpan={2} className="text-sm-medium pb-0">
                      Summe
                    </TableCell>
                  </TableRow>
                  <TableRow className="sm:hidden border-b-0">
                    <TableCell className="text-gray-11 pb-0">
                      {l("Niedrigste Miete")}
                    </TableCell>
                    <TableCell className="w-36 text-right pb-0">
                      {
                        merkmalStateTotalByGruppe[
                          merkmalGruppe as MerkmalGruppe
                        ].worst
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow className="sm:hidden">
                    <TableCell className="text-gray-11">
                      {l("Höchste Miete")}
                    </TableCell>
                    <TableCell className="w-36 text-right">
                      {
                        merkmalStateTotalByGruppe[
                          merkmalGruppe as MerkmalGruppe
                        ].best
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          );
        },
      )}
    </div>
  );
}
