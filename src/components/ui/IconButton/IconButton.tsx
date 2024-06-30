import cx from "classnames";
import { cva, type VariantProps } from "cva";
import React, { useRef } from "react";
import { Button as AriaButton, type ButtonProps } from "react-aria-components";
import { mergeRefs } from "react-merge-refs";

const iconButtonVariants = cva(
  "flex gap-1.5 font-450 rounded focus-visible:outline-none focus-visible:3 focus-visible:ring-primary focus-visible:border-primary-solid",
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
        unstyled: "",
      },
      size: {
        default: "px-4 py-3",
        sm: "px-3 py-2",
        unstyled: "",
      },
    },
    compoundVariants: [
      {
        color: "neutral",
        variant: "solid",
        class:
          "bg-neutral-solid text-on-neutral border-neutral-solid hover:bg-neutral-solid-hover hover:border-neutral-solid-hover active:bg-neutral-solid-active focus-visible:bg-neutral-solid",
      },
      {
        color: "neutral",
        variant: "outline",
        class:
          "bg-white border-neutral hover:bg-neutral-hover hover:border-neutral-hover active:bg-neutral-active focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-primary",
      },
      {
        color: "neutral",
        variant: "ghost",
        class:
          "bg-transparent text-neutral-faded border-transparent hover:bg-neutral-hover hover:text-neutral hover:border-neutral-hover active:bg-neutral-active focus-visible:bg-transparent",
      },

      {
        color: "primary",
        variant: "solid",
        class:
          "bg-primary-solid text-on-primary border-primary-solid hover:bg-primary-solid-hover hover:border-primary-solid-hover active:bg-primary-solid-active focus-visible:bg-primary-solid focus-visible:ring-3 focus-visible:ring-primary",
      },
      {
        color: "primary",
        variant: "outline",
        class:
          "bg-white border-primary text-primary hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-primary",
      },
      {
        color: "primary",
        variant: "ghost",
        class:
          "text-primary bg-transparent border-transparent hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active focus-visible:bg-white",
      },
    ],
    defaultVariants: {
      color: "neutral",
      variant: "outline",
      size: "default",
    },
  },
);

type IconButtonVariants = VariantProps<typeof iconButtonVariants>;
type IconButtonVariantProps = React.PropsWithChildren<IconButtonVariants> &
  Omit<ButtonProps, "className" | "onPress"> & {
    className?: string;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    onPress?: () => void;
  };

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonVariantProps
>(function IconButton({ className, children, onPress, ...props }, ref) {
  const localRef = useRef<HTMLButtonElement>(null);
  return (
    <AriaButton
      ref={mergeRefs([localRef, ref])}
      className={cx(className, iconButtonVariants(props))}
      type="button"
      {...props}
      {...{
        onPress: () => {
          if (onPress) {
            // workaround for facebook/react#11530
            // event.prevenDefault()
            onPress();
          }
        },
      }}
      style={{ ...props.style, touchAction: "none" }}
    >
      {children}
    </AriaButton>
  );
});
