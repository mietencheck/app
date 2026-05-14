import { cva, type VariantProps } from "cva";
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxProps as AriaCheckboxProps,
  CheckboxGroupProps,
} from "react-aria-components";

const checkboxButton = cva(
  "flex items-center justify-center w-4 h-4 border rounded-sm shadow-sm+inner",
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

type CheckboxButtonProps = VariantProps<typeof checkboxButton>;

function CheckboxButton(props: CheckboxButtonProps) {
  return (
    <div className="flex justify-center items-center w-5 h-6">
      <div className={checkboxButton(props)}>
        {props.isSelected && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

const checkbox = cva(
  "flex px-4 py-3 gap-2 border rounded shadow-sm group cursor-pointer",
  {
    variants: {
      isSelected: {
        true: "bg-gray-3 border-gray-7 hover:border-gray-8",
        false: "bg-white border-gray-7 hover:border-gray-8",
      },
      isFocusVisible: {
        true: "ring-3 ring-gray-5 border-gray-9 hover:border-gray-10",
      },
    },
  },
);

export function Checkbox({
  children,
  isSelected,
  ...props
}: AriaCheckboxProps & { children: React.ReactNode }) {
  return (
    <AriaCheckbox
      className={({ isFocusVisible }) =>
        checkbox({ isSelected, isFocusVisible })
      }
      isSelected={isSelected}
      {...props}
    >
      <CheckboxButton isSelected={isSelected} />
      <p>{children}</p>
    </AriaCheckbox>
  );
}

export function CheckboxGroup({
  autoFocus,
  options,
  value,
  ...props
}: {
  autoFocus?: boolean;
  options: { value: string; label: React.ReactNode }[];
} & CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup className="flex flex-col gap-2" value={value} {...props}>
      {options.map((o, i) => {
        const isSelected = value?.includes(o.value);
        return (
          <Checkbox
            key={o.value}
            value={o.value}
            autoFocus={autoFocus && i == 0}
            isSelected={isSelected}
          >
            {o.label}
          </Checkbox>
        );
      })}
    </AriaCheckboxGroup>
  );
}
