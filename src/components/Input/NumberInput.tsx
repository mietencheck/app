import { Input, InputProps } from "./Input";

export const NumberInput = ({
  onChange,
  ...props
}: Omit<InputProps, "onChange"> & InputProps) => (
  <Input type="number" onChange={(e) => onChange(e.target.value)} {...props} />
);
