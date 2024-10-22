import { Choice, Question } from "flow-machine";
import React, { useId } from "react";
import { mapKeys, mapValues } from "remeda";

import {
  NumberInput,
  RadioGroup,
  Select,
  SelectOption,
  WithTooltip,
} from "~/components/ui";
import { CheckboxGroup } from "~/components/ui/CheckboxGroup";
import { useLocaleState, useLocalizeField, useLocalizeString } from "~/l10n";
import { isKeyOfObject } from "~/utils";

import { questionTextLinks } from "./links";

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

export const GlossyText = React.memo(function GlossyText({
  alias,
  text,
}: {
  alias: string | null;
  text: string;
}) {
  const lString = useLocalizeString();
  const l = useLocalizeField();
  text = lString(text);
  const { glossary } = useLocaleState();
  return (
    <>
      {replaceWith(
        text,
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
    </>
  );
});

export function ChoiceControl({
  autoFocus,
  answer,
  value,
  onChange,
  hiddenOptionAliases,
  ...props
}: {
  autoFocus?: boolean;
  hiddenOptionAliases?: string[];
  answer: Choice;
  value: string;
  onChange: (value: string) => void;
  options?: { id: string; text: string }[];
}) {
  const l = useLocalizeString();
  const lField = useLocalizeField();
  const id = useId();
  let options = props.options ?? answer.options;
  if (hiddenOptionAliases) {
    options = answer.options.filter(
      (o) => !hiddenOptionAliases.includes(o.alias!),
    );
  }
  if (options.length <= 4) {
    return (
      <RadioGroup
        autoFocus={autoFocus}
        aria-labelledby={`${id}-label`}
        options={options.map((o) => ({
          value: o.id,
          label: l(o.text),
        }))}
        value={value ?? ""}
        onChange={onChange as never}
        isRequired
      />
    );
  }
  return (
    <Select
      id={id}
      autoFocus={autoFocus}
      className="w-full"
      selectedKey={value || ""}
      onSelectionChange={onChange as never}
      aria-labelledby={`${id}-label`}
      placeholder={lField("Bitte auswählen...")}
      isRequired
    >
      {options.map((o) => {
        const text = l(o.text);
        return (
          <SelectOption key={o.id} id={o.id} textValue={text}>
            {text}
          </SelectOption>
        );
      })}
    </Select>
  );
}

export function AnswerControl(props: {
  autoFocus?: boolean;
  hiddenOptionAliases?: string[];
  answer: Question["answer"];
  value: string;
  onChange: (value: string) => void;
}) {
  const { autoFocus, answer, value, onChange } = props;

  const l = useLocalizeString();
  const id = useId();

  switch (answer.type) {
    case "ChoiceAnswer": {
      return <ChoiceControl {...props} answer={answer} />;
    }

    case "MultiChoiceAnswer":
      return (
        <CheckboxGroup
          autoFocus={autoFocus}
          options={answer.options.map((o) => ({
            value: o.id,
            label: l(o.text),
          }))}
          value={value ? (value as unknown as string[]) : []}
          onChange={onChange as never}
          aria-labelledby={`${id}-label`}
          isRequired
        />
      );

    case "NumberAnswer":
      return (
        <NumberInput
          autoFocus={autoFocus}
          id={id}
          value={value || ""}
          onChange={onChange as never}
          required
        />
      );

    case "BooleanAnswer":
    case "TextAnswer":
      return null;

    default:
      answer satisfies never;
  }
}
