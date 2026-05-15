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
        className="w-full px-4 py-3 font-450 bg-white border border-gray-7 focus-visible:outline-none hover:border-gray-8 focus-visible:ring-3 focus-visible:ring-gray-5 focus-visible:border-gray-9"
        required={props.isRequired}
        title={title}
      />
    </AriaTextField>
  );
}
