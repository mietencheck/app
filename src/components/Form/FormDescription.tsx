import { mapKeys, mapValues, pipe } from "remeda";

import { useAnswers } from "~/form/flow-machine";
import { questionTextVars } from "~/form/question-text";
import { useLocalizeString } from "~/l10n";
import { isKeyOfObject, replaceWith } from "~/utils";

export function FormDescription({
  description,
  className,
  alias,
}: {
  description: string;
  className?: string;
  alias: string | null;
}) {
  const l = useLocalizeString();
  description = l(description);
  const answers = useAnswers();

  return (
    <p className={className}>
      {replaceWith(
        description,
        alias && isKeyOfObject(alias, questionTextVars)
          ? pipe(
              questionTextVars[alias]!,
              mapKeys((k) => `$${k}$`),
              mapValues((f) => f(answers)),
            )
          : {},
      )}
    </p>
  );
}
