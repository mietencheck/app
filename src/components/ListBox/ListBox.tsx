import cx from "classnames";
import { ReactNode, useEffect, useRef } from "react";
import {
  ListBoxItem as AriaItem,
  ListBoxItemProps as AriaItemProps,
  ListBox as AriaListBox,
  ListBoxProps as AriaListBoxProps,
  ListBoxItemRenderProps,
} from "react-aria-components";

import { CheckIcon } from "../Icons/Check";

export const LIST_BOX_CLASS_NAME =
  "w-full min-w-[160px] max-h-[inherit] overflow-auto space-y-0.5 p-1 bg-white border border-gray-7 rounded shadow focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purple-5 focus-visible:border-purple-9";
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
  "hover:bg-purple-9 hover:text-white active:bg-purple-9 active:text-white focus-visible:outline-none focus-visible:bg-purple-9 focus-visible:text-white",
);
export function ListBoxItem({
  children,
  ...props
}: AriaItemProps & {
  children: ReactNode | ((props: ListBoxItemRenderProps) => ReactNode);
}) {
  return (
    <AriaItem className={LISTBOX_ITEM_CLASS_NAME} {...props}>
      {(renderProps) => (
        <>
          {renderProps.isSelected ? (
            <CheckIcon
              aria-hidden="true"
              className="text-gray-11 group-hover:text-white group-active:text-white group-focus-visible:text-white"
            />
          ) : (
            <span className="w-5" />
          )}
          {typeof children === "function" ? children(renderProps) : children}
        </>
      )}
    </AriaItem>
  );
}
