import {
  Input as AriaInput,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

export function TextField({
  title,
  ...props
}: { title?: string } & AriaTextFieldProps) {
  return (
    <AriaTextField {...props}>
      <AriaInput
        className="w-full px-4 py-3 font-450 bg-white border border-neutral rounded shadow focus-visible:outline-none hover:border-neutral-hover focus-visible:ring-3 focus-visible:ring-primary focus-visible:border-primary-solid"
        required={props.isRequired}
        title={title}
      />
    </AriaTextField>
  );
}
