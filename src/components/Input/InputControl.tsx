import { Question } from "flow-machine";

import {
  CheckboxGroup,
  Input,
  NumberInput,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import { useLocalizeField, useLocalizeString } from "~/l10n";

export function InputControl({
  id,
  autoFocus,
  answer,
  value,
  onChange,
}: {
  id: string;
  autoFocus?: boolean;
  answer: Question["answer"];
  value: string;
  alias: string | null;
  onChange: (value: string) => void;
}) {
  const l = useLocalizeString();
  const lField = useLocalizeField();

  switch (answer.type) {
    case "ChoiceAnswer": {
      if (answer.options.length <= 5) {
        return (
          <RadioGroup
            autoFocus={autoFocus}
            aria-labelledby={`${id}-label`}
            options={answer.options.map((o) => ({
              value: o.id,
              label: l(o.text),
            }))}
            value={value ?? ""}
            onChange={onChange as never}
            isRequired
          />
        );
      }
      const items = Object.fromEntries(
        answer.options.map((o) => [o.id, l(o.text)] as const),
      );

      return (
        <Select
          value={value || null}
          onValueChange={(v) => onChange(v ?? "")}
          required
          items={items}
        >
          <SelectTrigger
            id={id}
            autoFocus={autoFocus}
            className="w-full"
            aria-labelledby={`${id}-label`}
          >
            <SelectValue placeholder={lField("Bitte auswählen...")} />
          </SelectTrigger>
          <SelectContent>
            {answer.options.map((o) => {
              const text = l(o.text);
              return (
                <SelectItem key={o.id} value={o.id} label={text}>
                  {text}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
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

    case "DateAnswer":
      return (
        <Input
          autoFocus={autoFocus}
          id={id}
          value={value || ""}
          type="date"
          onChange={(e) => onChange(e.target.value)}
          required
        />
      );

    case "BooleanAnswer":
      return null;
    case "TextAnswer":
      return null;

    default:
      answer satisfies never;
  }
}
