import { VisuallyHidden } from "react-aria";
import {
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  SelectValue as AriaSelectValue,
} from "react-aria-components";

import { Button } from "../Button/Button";
import { ChevronDownIcon } from "../Icons/ChevronDown";
import { ListBox } from "../ListBox/ListBox";

export function Select<T extends object>({
  children,
  ...props
}: AriaSelectProps<T>) {
  return (
    <AriaSelect {...props}>
      <Button
        width="full"
        iconEnd={
          <ChevronDownIcon className="text-neutral-faded hover:text-neutral" />
        }
      >
        <AriaSelectValue />
      </Button>
      {props.isRequired && (
        <VisuallyHidden>
          <input
            type="text"
            value={(props.selectedKey as never) ?? undefined}
            onChange={() => null}
            required
          />
        </VisuallyHidden>
      )}
      <AriaPopover className="w-[--trigger-width]" offset={4}>
        <ListBox>{children}</ListBox>
      </AriaPopover>
    </AriaSelect>
  );
}

export { ListBoxItem as SelectOption } from "../ListBox/ListBox";
