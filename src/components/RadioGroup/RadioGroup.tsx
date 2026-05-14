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
        true: "bg-gray-9 border-gray-9 hover:bg-gray-10 hover:border-gray-10",
        false:
          "bg-white border-gray-7 hover:bg-gray-1 hover:border-gray-8 group-hover:border-gray-8",
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
  "flex px-3.5 py-2.5 gap-2 border shadow-sm group cursor-pointer",
  {
    variants: {
      isSelected: {
        true: "bg-gray-3 border-gray-7 hover:border-gray-8",
        false: "bg-white border-gray-7 hover:border-gray-8",
      },
      isFocusVisible: {
        true: "ring-3 ring-gray-5 border-gray-7 hover:border-gray-8",
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
