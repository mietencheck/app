import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { buttonVariants } from "~/components/Button/Button";
import { cn } from "~/lib/utils";

type LinkProps = React.ComponentPropsWithoutRef<"a"> &
  VariantProps<typeof buttonVariants> & {
    disabled?: boolean;
  };

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    className,
    variant = "link",
    size = "base",
    color = "gray",
    disabled = false,
    target,
    rel,
    onClick,
    tabIndex,
    ...props
  },
  ref,
) {
  const resolvedRel =
    target === "_blank"
      ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ")
      : rel;

  return (
    <a
      ref={ref}
      {...props}
      data-slot="link"
      target={target}
      rel={resolvedRel}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      className={cn(
        buttonVariants({ variant, size, color, className }),
        disabled && "pointer-events-none opacity-50",
      )}
      onClick={
        disabled
          ? (event) => {
              event.preventDefault();
            }
          : onClick
      }
    />
  );
});

export { Link, type LinkProps };
