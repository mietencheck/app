import {
  TextArea as AriaTextArea,
  TextAreaProps as AriaTextAreaProps,
} from "react-aria-components";

export function TextArea({
  title,
  ...props
}: { title?: string } & AriaTextAreaProps) {
  return (
    <AriaTextArea
      className="w-full px-4 py-3 font-450 bg-white border border-neutral rounded shadow focus-visible:outline-none hover:border-neutral-hover focus-visible:ring-3 focus-visible:ring-primary focus-visible:border-primary-solid"
      title={title}
      {...props}
    />
  );
}
