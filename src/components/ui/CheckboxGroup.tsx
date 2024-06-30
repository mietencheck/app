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
        true: "bg-primary-solid border-primary-solid hover:bg-primary-solid-hover hover:border-primary-solid-hover",
        false:
          "bg-white border-neutral hover:bg-page-faded hover:border-neutral-hover group-hover:border-neutral-hover",
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
        true: "bg-primary border-primary hover:border-primary-hover",
        false: "bg-white border-neutral hover:border-neutral-hover",
      },
      isFocusVisible: {
        true: "ring-3 ring-primary border-primary-solid hover:border-primary-solid-hover",
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
