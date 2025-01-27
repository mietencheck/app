import { Input, InputProps } from "./Input";

export const TextInput = ({ onChange, ...props }: InputProps) => (
  <Input type="text" onChange={(e) => onChange(e.target.value)} {...props} />
);
