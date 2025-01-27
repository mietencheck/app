import { mapKeys, mapValues } from "remeda";

import { questionTextLinks } from "~/form/links";
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
              mapKeys(questionTextLinks[alias]!, l as any),
              (href, text) => (
                <a key={text} href={href} target="_blank" className="underline">
                  {text}
                </a>
              ),
            )
          : {},
      )}
    </Label>
  );
}
