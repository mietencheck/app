import {
  Label as AriaLabel,
  LabelProps as AriaLabelProps,
} from "react-aria-components";

export function Label({ children, ...props }: AriaLabelProps) {
  return <AriaLabel {...props}>{children}</AriaLabel>;
}
