import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-gray-5 focus-visible:border-gray-9 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        solid: "text-white",
        outline: "bg-white border-gray-9 hover:bg-gray-4",
        light: "bg-gray-3 hover:bg-gray-4",
        ghost: "hover:bg-gray-4",
        link: "underline-offset-4 hover:underline focus-visible:underline",
      },
      color: {
        gray: "",
        red: "",
        yellow: "",
        blue: "",
        pink: "",
        purple: "",
        green: "",
      },
      size: {
        sm: "gap-1.5 px-2 py-1.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        base: "gap-1.5 px-3 py-2 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "gap-1.5 px-4 py-3 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        icon: "h-[42px] w-[42px]",
        "icon-sm": "h-[34px] w-[34px]",
      },
    },
    defaultVariants: {
      variant: "solid",
      color: "gray",
      size: "base",
    },
    compoundVariants: [
      {
        variant: "link",
        class: "p-0 border-none",
      },
      {
        variant: "solid",
        color: "gray",
        class: "bg-gray-9 hover:bg-gray-10",
      },
      {
        variant: "solid",
        color: "red",
        class: "bg-red-9 hover:bg-red-10",
      },
      {
        variant: "solid",
        color: "yellow",
        class: "bg-yellow-9 hover:bg-yellow-10 text-black",
      },
      {
        variant: "solid",
        color: "blue",
        class: "bg-blue-9 hover:bg-blue-10",
      },
      {
        variant: "solid",
        color: "pink",
        class: "bg-pink-9 hover:bg-pink-10",
      },
      {
        variant: "solid",
        color: "purple",
        class: "bg-purple-9 hover:bg-purple-10",
      },
      {
        variant: "solid",
        color: "green",
        class: "bg-green-9 hover:bg-green-10",
      },
    ],
  },
);

const Button = React.forwardRef<
  HTMLElement,
  ButtonPrimitive.Props & VariantProps<typeof buttonVariants>
>(function Button(
  { className, variant = "solid", color = "gray", size = "base", ...props },
  ref,
) {
  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, color, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
