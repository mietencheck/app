import cx from "classnames";
import { useEffect, useRef } from "react";
import {
  ListBoxItem as AriaItem,
  ListBoxItemProps as AriaItemProps,
  ListBox as AriaListBox,
  ListBoxProps as AriaListBoxProps,
} from "react-aria-components";

import { CheckIcon } from "../Icons/Check";

export const LIST_BOX_CLASS_NAME =
  "w-full min-w-[160px] max-h-[inherit] overflow-auto space-y-0.5 p-1 bg-white border border-neutral rounded shadow focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary focus-visible:border-primary-solid";
export function ListBox<T extends object>({
  children,
  ...props
}: AriaListBoxProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Workaround for adobe/react-spectrum#1513
    ref.current?.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
      },
      { passive: false, once: true },
    );
  }, []);
  return (
    <AriaListBox className={LIST_BOX_CLASS_NAME} ref={ref} {...props}>
      {children}
    </AriaListBox>
  );
}

export const LISTBOX_ITEM_CLASS_NAME = cx(
  "border border-transparent rounded-sm px-3 py-2",
  "group flex gap-1.5",
  "hover:bg-primary-solid hover:text-on-primary active:bg-primary-solid active:text-on-primary focus-visible:outline-none focus-visible:bg-primary-solid focus-visible:text-on-primary",
);
export function ListBoxItem({ children, ...props }: AriaItemProps) {
  return (
    <AriaItem className={LISTBOX_ITEM_CLASS_NAME} {...props}>
      {({ isSelected }) => (
        <>
          {isSelected ? (
            <CheckIcon
              aria-hidden="true"
              className="text-neutral-faded group-hover:text-on-primary group-active:text-on-primary group-focus-visible:text-on-primary"
            />
          ) : (
            <span className="w-5" />
          )}
          {children}
        </>
      )}
    </AriaItem>
  );
}
