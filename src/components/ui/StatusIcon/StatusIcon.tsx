import { cva, type VariantProps } from "cva";

import { CheckIcon } from "~/components/ui/Icons/Check";
import { MoreHorizontalIcon } from "~/components/ui/Icons/MoreHorizontal";

const statusIconVariants = cva(
  "flex w-[18px] h-[18px] items-center justify-center rounded-full",
  {
    variants: {
      status: {
        default: "bg-page-faded border border-neutral",
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
