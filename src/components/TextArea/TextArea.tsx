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
      className="w-full px-4 py-3 font-450 bg-white border border-gray-7 rounded shadow focus-visible:outline-none hover:border-gray-8 focus-visible:ring-3 focus-visible:ring-purple-5 focus-visible:border-purple-9"
      title={title}
      {...props}
    />
  );
}
