import { mapKeys, mapValues, pipe } from "remeda";

import { useAnswers } from "~/form/flow-machine";
import { questionTextLinks, questionTextVars } from "~/form/question-text";
import { useLocaleState, useLocalizeField, useLocalizeString } from "~/l10n";
import { isKeyOfObject } from "~/utils";

import { Label, WithTooltip } from "..";

function replaceWith(
  text: string,
  ...replacementMaps: Record<string, React.ReactNode>[]
): React.ReactNode[] {
  let parts: React.ReactNode[] = [text];
  for (const replacementsMap of replacementMaps) {
    for (const [needle, replacement] of Object.entries(replacementsMap)) {
      parts = parts.flatMap((part) =>
        typeof part == "string"
          ? part
              .split(needle)
              .flatMap((subpart, i, a) =>
                i + 1 < a.length ? [subpart, replacement] : [subpart],
              )
          : [part],
      );
    }
  }
  return parts;
}

export function FormLabel({
  htmlFor,
  alias,
  label,
  className,
}: {
  htmlFor: string;
  alias: string | null;
  label: string;
  className?: string;
}) {
  const lString = useLocalizeString();
  const l = useLocalizeField();
  label = lString(label);
  const { glossary } = useLocaleState();
  const answers = useAnswers();

  return (
    <Label htmlFor={htmlFor} id={`${htmlFor}-label`} className={className}>
      {replaceWith(
        label,
        mapValues(glossary, (text, term) => (
          <WithTooltip key={term} content={text}>
            {term}
          </WithTooltip>
        )),
        alias && isKeyOfObject(alias, questionTextLinks)
          ? mapValues(
              mapKeys(questionTextLinks[alias]!, l as never),
              (href, text) => (
                <a key={text} href={href} target="_blank" className="underline">
                  {text}
                </a>
              ),
            )
          : {},
        alias && isKeyOfObject(alias, questionTextVars)
          ? pipe(
              questionTextVars[alias]!,
              mapKeys((k) => `$${k}$`),
              mapValues((f) => f(answers)),
            )
          : {},
      )}
    </Label>
  );
}
