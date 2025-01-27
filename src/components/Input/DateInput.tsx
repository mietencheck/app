import { Input, InputProps } from "./Input";

export const DateInput = ({
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "ref" | "value" | "onChange"> &
  InputProps) => (
  <Input type="date" onChange={(e) => onChange(e.target.value)} {...props} />
);
