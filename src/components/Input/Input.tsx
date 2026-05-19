import React from "react";

export type InputProps = Omit<React.ComponentProps<"input">, "type" | "ref"> & {
  value: string;
  onChange: (value: string) => void;
};

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={
        className +
        " " +
        "w-full px-4 py-3 bg-white border border-gray-7 hover:border-gray-8 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gray-5 focus-visible:border-gray-9"
      }
      {...props}
    />
  );
});
