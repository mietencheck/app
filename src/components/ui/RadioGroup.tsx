import { cva, type VariantProps } from "cva";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  RadioGroupProps,
} from "react-aria-components";

const radioButton = cva(
  "flex items-center justify-center w-4 h-4 border rounded-full shadow-sm+inner",
  {
    variants: {
      isSelected: {
        true: "bg-primary-solid border-primary-solid hover:bg-primary-solid-hover hover:border-primary-solid-hover",
        false:
          "bg-white border-neutral hover:bg-page-faded hover:border-neutral-hover group-hover:border-neutral-hover",
      },
    },
  },
);

type RadioButtonProps = VariantProps<typeof radioButton>;

function RadioButton(props: RadioButtonProps) {
  return (
    <div className="flex justify-center items-center w-5 h-6">
      <div className={radioButton(props)}>
        {props.isSelected && (
          <div className="w-[5px] h-[5px] bg-white rounded-full shadow-sm"></div>
        )}
      </div>
    </div>
  );
}

const radio = cva(
  "flex px-4 py-3 gap-2 border rounded shadow-sm group cursor-pointer",
  {
    variants: {
      isSelected: {
        true: "bg-primary border-primary hover:border-primary-hover",
        false: "bg-white border-neutral hover:border-neutral-hover",
      },
      isFocusVisible: {
        true: "ring-3 ring-primary border-primary-solid hover:border-primary-solid-hover",
      },
    },
  },
);

type Option = {
  value: string;
  label: string;
};

export function Radio({
  option,
  autoFocus,
  isSelected,
}: {
  option: Option;
  autoFocus?: boolean;
  isSelected: boolean;
}) {
  return (
    <AriaRadio
      className={({ isFocusVisible }) => radio({ isSelected, isFocusVisible })}
      value={option.value}
      autoFocus={autoFocus}
    >
      <RadioButton isSelected={isSelected} />
      <p className="text-base">{option.label}</p>
    </AriaRadio>
  );
}

export const RadioGroup = ({
  autoFocus,
  options,
  ...props
}: { autoFocus?: boolean; options: Option[] } & RadioGroupProps) => {
  return (
    <AriaRadioGroup
      className="flex flex-col gap-2"
      {...props}
      // this will be fixed in a future version of react-aria
      value={props.value || (null as unknown as string)}
    >
      {options.map((option, i) => {
        const isSelected = props.value == option.value;
        return (
          <AriaRadio
            key={i}
            className={({ isFocusVisible }) =>
              radio({ isSelected, isFocusVisible })
            }
            value={option.value}
            autoFocus={autoFocus && (props.value ? isSelected : i == 0)}
          >
            <RadioButton isSelected={isSelected} />
            <p className="text-base">{option.label}</p>
          </AriaRadio>
        );
      })}
    </AriaRadioGroup>
  );
};
