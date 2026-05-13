import { cva, type VariantProps } from "cva";

import { CheckIcon } from "~/components/Icons/Check";
import { MoreHorizontalIcon } from "~/components/Icons/MoreHorizontal";

const statusIconVariants = cva(
  "flex w-[18px] h-[18px] items-center justify-center rounded-full",
  {
    variants: {
      status: {
        default: "bg-gray-1 border border-gray-7",
        active: "bg-green-2 border border-green-7 text-green-11",
        completed: "bg-green-9 border border-green-9 text-white",
      },
    },
  },
);

export type StatusIconProps = VariantProps<typeof statusIconVariants>;

export function StatusIcon({ ...props }: StatusIconProps) {
  return (
    <span className="w-5 flex items-center">
      <span className={statusIconVariants(props)}>
        {props.status === "active" && <MoreHorizontalIcon />}
        {props.status === "completed" && <CheckIcon />}
      </span>
    </span>
  );
}
