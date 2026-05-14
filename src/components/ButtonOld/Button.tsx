import cx from "classnames";
import { cva, type VariantProps } from "cva";
import React, { useRef } from "react";
import { Button as AriaButton, type ButtonProps } from "react-aria-components";
import { mergeRefs } from "react-merge-refs";

/** Legacy RAC button styles — only for use with react-aria `DialogTrigger` until overlays move to Base UI. */
const legacyButtonVariants = cva(
  "flex gap-1.5 font-medium focus-visible:outline-none focus-visible:3 focus-visible:ring-purple-5 focus-visible:border-purple-9",
  {
    variants: {
      color: {
        neutral: "",
        primary: "",
        unstyled: "",
      },
      variant: {
        solid: "border shadow-sm+inner",
        outline: "border shadow-sm+inner",
        ghost: "border",
        inline: "pt-0 pr-0 pb-0 pl-0",
        unstyled: "",
      },
      size: {
        default: "px-4 py-3",
        sm: "px-3 py-2",
      },
      width: {
        full: "w-full",
      },
    },
    compoundVariants: [
      {
        color: "neutral",
        variant: "solid",
        class:
          "bg-gray-9 text-white border-gray-9 hover:bg-gray-10 hover:border-gray-10 active:bg-gray-11 focus-visible:bg-gray-9",
      },
      {
        color: "neutral",
        variant: "outline",
        class:
          "bg-white border-gray-7 hover:bg-gray-4 hover:border-gray-8 active:bg-gray-5 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-purple-5",
      },
      {
        color: "neutral",
        variant: "ghost",
        class:
          "bg-transparent border-transparent hover:bg-gray-4 hover:border-gray-8 active:bg-gray-5 focus-visible:bg-transparent",
      },
      {
        color: "neutral",
        variant: "inline",
        class:
          "text-gray-11 border border-transparent hover:text-gray-12 hover:underline focus:border-gray-7",
      },
      {
        color: "primary",
        variant: "solid",
        class:
          "bg-purple-9 text-white border-purple-9 hover:bg-purple-10 hover:border-purple-10 active:bg-purple-11 focus-visible:bg-purple-9 focus-visible:ring-3 focus-visible:ring-purple-5",
      },
      {
        color: "primary",
        variant: "outline",
        class:
          "bg-white border-purple-7 text-purple-11 hover:bg-purple-4 hover:border-purple-8 active:bg-purple-5 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-purple-5",
      },
      {
        color: "primary",
        variant: "ghost",
        class:
          "text-purple-11 bg-transparent border-transparent hover:bg-purple-4 hover:border-purple-8 active:bg-purple-5 focus-visible:bg-white",
      },
      {
        color: "primary",
        variant: "inline",
        class: "text-purple-11 hover:underline",
      },
    ],
    defaultVariants: {
      color: "neutral",
      variant: "outline",
      size: "default",
    },
  },
);

type LegacyVariants = VariantProps<typeof legacyButtonVariants>;
type ButtonOldProps = React.PropsWithChildren<LegacyVariants> &
  Omit<ButtonProps, "className" | "onPress"> & {
    className?: string;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    onPress?: () => void;
  };

export const ButtonOld = React.forwardRef<HTMLButtonElement, ButtonOldProps>(
  function ButtonOld(
    { className, children, iconStart, iconEnd, onPress, ...props },
    ref,
  ) {
    const localRef = useRef<HTMLButtonElement>(null);
    return (
      <AriaButton
        ref={mergeRefs([localRef, ref])}
        className={cx(className, legacyButtonVariants(props))}
        type="button"
        {...props}
        {...{
          onPress: () => {
            if (onPress) {
              onPress();
            }
          },
        }}
        style={{ ...props.style, touchAction: "none" }}
      >
        {iconStart}
        <span className="block flex-grow text-left">{children}</span>
        {iconEnd}
      </AriaButton>
    );
  },
);

ButtonOld.displayName = "ButtonOld";
