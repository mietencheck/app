/**
 * Renders the review documents under docs/review/. They are generated from
 * the mapping, the questionnaire and the Merkmal texts and kept up to date by
 * file snapshots, so every change to wording or mapping shows up in a diff.
 */
import { merkmaleDescriptionsByYear } from "~/mietspiegel/merkmale";
import { Mietspiegeljahr } from "~/mietspiegel/types";

import {
  FlowQuestion,
  questionByAlias,
  questionCopiesByAlias,
  questionNodeById,
} from "./flow-paths";
import {
  answerAlternatives,
  deviationsFor,
  excludedPeriodsFromText,
  mappingFor,
  ScenarioCoverage,
} from "./merkmal-coverage";
import {
  decisionKey,
  merkmalReviewDecisions,
} from "./merkmal-review-decisions";

const GRUPPEN = ["Bad", "Küche", "Wohnung", "Gebäude", "Umfeld"] as const;

function optionText(question: FlowQuestion | undefined, value: unknown) {
  const option = question?.answer.options?.find((o) => o.alias === value);
  return option?.text ?? String(value);
}

/** The copies of `alias` that were asked in this edition (or the first one). */
function askedCopies(alias: string, questionIds: Set<string>) {
  const asked = (questionCopiesByAlias.get(alias) ?? [])
    .map((c) => c.node)
    .filter((q) => questionIds.has(q.id));
  const copies = asked.length > 0 ? asked : [questionByAlias(alias)!];
  const seen = new Set<string>();
  return copies.filter((q) => {
    const signature = JSON.stringify([q.text.trim(), q.answer.options]);
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}

function conditionText(merkmal: string, questionIds: Set<string>) {
  const mapping = mappingFor(merkmal);
  const checkedIf = mapping.checked_if as Record<string, unknown>;
  const alternatives = answerAlternatives(mapping);
  const render = (answers: Record<string, unknown>) =>
    Object.entries(answers)
      .map(([alias, value]) =>
        askedCopies(alias, questionIds)
          .map(
            (q) =>
              `„${q.text.trim()}“ = **${optionText(q, value)}** (\`${alias}\`)`,
          )
          .join(" *bzw. je nach Baujahr* "),
      )
      .join("\n  - und ");
  if ("logic" in checkedIf && checkedIf.logic === "or") {
    return `- ${alternatives.map(render).join("\n- **oder** ")}`;
  }
  return `- ${render(alternatives[0])}`;
}

export function renderMerkmalSheet(
  jahr: Mietspiegeljahr,
  coverages: ScenarioCoverage[],
): string {
  const descriptions = merkmaleDescriptionsByYear[jahr];
  const periods = coverages[0].periods;
  const deviations = coverages.flatMap((c) => deviationsFor(c, descriptions));
  const lines: string[] = [
    `# Merkmal-Review Mietspiegel ${jahr}`,
    "",
    "> Automatisch erzeugt von `src/form/verification/merkmal-review.test.ts`.",
    "> Nicht von Hand bearbeiten; Änderungen mit `pnpm test:review -u` übernehmen.",
    "",
    "Für jedes Merkmal der Orientierungshilfe: der Text aus dem Mietspiegel, die",
    "Antworten, bei denen der Fragebogen das Merkmal als erfüllt wertet, und in",
    "welchen Baualtersklassen der Fragebogen es überhaupt als erfüllt werten kann",
    "(per Lösungssuche über den echten Fragebogen ermittelt).",
    "",
    "Bitte je Merkmal prüfen:",
    "",
    "1. Fragt die Frage genau das ab, was der Mietspiegeltext meint (Schwellenwerte, Ausnahmen, Gäste-WC usw.)?",
    "2. Stimmen die erreichbaren Baualtersklassen mit den Einschränkungen im Text überein?",
    "",
    "„Nicht sicher“ wird für die Spanne als *vielleicht* gewertet: im ungünstigsten",
    "und im günstigsten Fall jeweils so, dass die Spanne maximal wird.",
    "Baualtersklassen ab 2015 entfallen, weil Neubauten den Fragebogen verlassen (§ 556f BGB).",
    "",
    `Legende: ✓ erreichbar · – nicht erreichbar · ⚠ Abweichung vom Text (siehe Hinweis)`,
    "",
  ];

  const scenarioLabel = (c: ScenarioCoverage) =>
    coverages.length > 1 ? c.scenario.label : "Fragebogen";

  for (const gruppe of GRUPPEN) {
    const merkmale = coverages[0].rows
      .map((r) => r.merkmal)
      .filter((m) => m.startsWith(`[${gruppe}`))
      .sort((a, b) => a.localeCompare(b, "de"));
    if (merkmale.length === 0) continue;
    lines.push(`## ${gruppe === "Umfeld" ? "Wohnumfeld" : gruppe}`, "");
    for (const merkmal of merkmale) {
      const text = descriptions[merkmal];
      const excluded = excludedPeriodsFromText(text, periods);
      const questionIds = new Set(
        coverages.flatMap(
          (c) => c.rows.find((r) => r.merkmal === merkmal)!.questionIds,
        ),
      );
      lines.push(
        `### ${merkmal}`,
        "",
        `**Mietspiegel:** ${text}`,
        "",
        "**Erfüllt, wenn:**",
        "",
        conditionText(merkmal, questionIds),
        "",
        `| | ${periods.map((p) => p.label).join(" | ")} |`,
        `|---|${periods.map(() => ":-:").join("|")}|`,
        `| Laut Text | ${periods.map((p) => (excluded.includes(p.label) ? "–" : "✓")).join(" | ")} |`,
      );
      for (const coverage of coverages) {
        const row = coverage.rows.find((r) => r.merkmal === merkmal)!;
        lines.push(
          `| ${scenarioLabel(coverage)} | ${periods
            .map((p) => {
              const ok = row.checkable[p.label];
              const deviates = deviations.some(
                (d) =>
                  d.merkmal === merkmal &&
                  d.period === p.label &&
                  d.scenario === coverage.scenario.label,
              );
              return `${ok ? "✓" : "–"}${deviates ? " ⚠" : ""}`;
            })
            .join(" | ")} |`,
        );
      }
      const own = [
        ...new Set(
          deviations
            .filter((d) => d.merkmal === merkmal)
            .map((d) => decisionKey(jahr, merkmal, d.period)),
        ),
      ];
      const hinweise = [
        ...new Set(
          own.map((key) => {
            const decision = merkmalReviewDecisions[key];
            return decision
              ? `**${decision.status}:** ${decision.hinweis}`
              : "**offen:** Noch keine Entscheidung erfasst.";
          }),
        ),
      ];
      lines.push("");
      for (const hinweis of hinweise) lines.push(`⚠ ${hinweis}`, "");
      lines.push("- [ ] geprüft", "");
    }
  }
  return lines.join("\n");
}

export type AskedQuestion = { id: string; jahre: string[] };

/** Wording of every question copy reachable in the Miete flow. */
export function renderQuestionCatalogue(asked: AskedQuestion[]): string {
  const lines = [
    "# Fragen im Fragebogen (Miete)",
    "",
    "> Automatisch erzeugt von `src/form/verification/questions.test.ts`.",
    "> Nicht von Hand bearbeiten; Änderungen mit `pnpm test:review -u` übernehmen.",
    "",
    "Alle Fragen, die im Miete-Ablauf gestellt werden können, mit Wortlaut,",
    "Hinweistext und Antwortoptionen, getrennt nach Mietspiegel-Ausgabe, wenn",
    "sich die Formulierung unterscheidet. Jede Änderung an Formulierungen",
    "erscheint als Diff in dieser Datei und sollte fachlich gegengelesen werden.",
    "",
  ];
  const byAlias = new Map<
    string,
    Map<string, { q: FlowQuestion; jahre: Set<string> }>
  >();
  for (const { id, jahre } of asked) {
    const q = questionNodeById.get(id)!;
    const signature = JSON.stringify([
      q.text.trim(),
      q.info?.trim() ?? "",
      q.answer,
    ]);
    const variants = byAlias.get(q.alias) ?? new Map();
    const variant = variants.get(signature) ?? { q, jahre: new Set<string>() };
    jahre.forEach((j) => variant.jahre.add(j));
    variants.set(signature, variant);
    byAlias.set(q.alias, variants);
  }
  for (const alias of [...byAlias.keys()].sort((a, b) =>
    a.localeCompare(b, "de"),
  )) {
    lines.push(`## \`${alias}\``, "");
    const variants = [...byAlias.get(alias)!.values()];
    for (const { q, jahre } of variants) {
      if (variants.length > 1) {
        lines.push(`*Mietspiegel ${[...jahre].sort().join(", ")}:*`, "");
      }
      lines.push(`**Frage:** ${q.text.trim()}`, "");
      if (q.info?.trim()) lines.push(`**Hinweis:** ${q.info.trim()}`, "");
      const options = q.answer.options ?? [];
      if (options.length > 0) {
        for (const o of options) {
          lines.push(`- ${o.text ?? ""}${o.alias ? ` (\`${o.alias}\`)` : ""}`);
        }
      } else {
        lines.push(`- Antworttyp: ${q.answer.type}`);
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}
