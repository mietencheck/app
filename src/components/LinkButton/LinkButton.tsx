import { Link } from "@swan-io/chicane";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { buttonVariants } from "~/components/Button/Button";
import { cn } from "~/lib/utils";

type LinkButtonProps = Omit<React.ComponentProps<typeof Link>, "className"> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
  };

export function LinkButton({
  className,
  children,
  iconStart,
  iconEnd,
  variant = "outline",
  color = "gray",
  size = "base",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, color, size }), className)}
      {...props}
    >
      {iconStart}
      <span className="block flex-grow text-left">{children}</span>
      {iconEnd}
    </Link>
  );
}
