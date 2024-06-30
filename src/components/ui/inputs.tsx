import React from "react";

type InputProps = Omit<React.ComponentProps<"input">, "type" | "ref"> & {
  value: string;
  onChange: (value: string) => void;
};

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={
        className +
        " " +
        "w-full px-4 py-3 bg-white border border-neutral rounded shadow hover:border-neutral-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary focus-visible:border-primary-solid"
      }
      {...props}
    />
  );
});

export const DateInput = ({
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "ref" | "value" | "onChange"> &
  InputProps) => (
  <Input type="date" onChange={(e) => onChange(e.target.value)} {...props} />
);

export const NumberInput = ({
  onChange,
  ...props
}: Omit<InputProps, "onChange"> & InputProps) => (
  <Input type="number" onChange={(e) => onChange(e.target.value)} {...props} />
);

export const TextInput = ({ onChange, ...props }: InputProps) => (
  <Input type="text" onChange={(e) => onChange(e.target.value)} {...props} />
);
