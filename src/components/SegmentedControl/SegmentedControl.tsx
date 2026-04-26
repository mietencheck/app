import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { ReactNode } from "react";

type Option<Value extends string> = {
  value: Value;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps<Value extends string> = {
  options: Option<Value>[];
  value: Value | null;
  onValueChange: (value: Value) => void;
  className?: string;
} & Omit<
  BaseRadioGroup.Props<Value>,
  "value" | "defaultValue" | "onValueChange" | "children"
>;

export function SegmentedControl<Value extends string>({
  options,
  value,
  onValueChange,
  className,
  ...rest
}: SegmentedControlProps<Value>) {
  return (
    <BaseRadioGroup
      value={value ?? undefined}
      onValueChange={(next) => onValueChange(next as Value)}
      className={`inline-flex border border-neutral rounded overflow-hidden bg-white divide-x divide-neutral ${className ?? ""}`}
      {...rest}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          aria-label={option.label}
          title={option.label}
          className="px-2 py-1.5 text-center cursor-pointer select-none outline-none transition-colors hover:bg-page-faded data-[checked]:bg-primary data-[checked]:text-primary data-[checked]:hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:relative"
        >
          {option.icon ?? option.label}
        </Radio.Root>
      ))}
    </BaseRadioGroup>
  );
}
