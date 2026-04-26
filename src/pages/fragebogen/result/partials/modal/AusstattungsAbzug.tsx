import { getWorstBestAusstattungsAbzug } from "~/calculation/ausstattungsAbzug";
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
import { formatEuro } from "~/utils";

export function AusstattungsAbzugTable() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  const l = useLocalizeField();

  const ctx = answersToCalculationContext(answers, visibleQuestionAliases);
  if (!ctx) {
    return null;
  }

  const { worst: worstAusstattungsAbzug, best: bestAusstattungsAbzug } =
    getWorstBestAusstattungsAbzug(ctx) || { worst: 0, best: 0 };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{l("Ausstattungsabzug")}</TableHead>
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
        <TableRow className="hidden sm:table-row">
          <TableCell>{l("Wert")}</TableCell>
          <TableCell className="w-40 text-right">
            {formatEuro(bestAusstattungsAbzug)}
          </TableCell>
          <TableCell className="w-40 text-right">
            {formatEuro(worstAusstattungsAbzug)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
