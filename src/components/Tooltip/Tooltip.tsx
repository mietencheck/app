import {
  OverlayArrow as AriaOverlayArrow,
  Popover as AriaPopover,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  Button,
  DialogTrigger,
} from "react-aria-components";
import { useMediaQuery } from "usehooks-ts";

function Floater({
  canHover,
  children,
}: {
  canHover: boolean;
  children: React.ReactNode;
}) {
  const Root = canHover ? AriaTooltip : AriaPopover;
  return (
    <Root
      offset={4}
      className="max-w-xs px-3 py-2 bg-gray-12 text-sm text-white rounded"
    >
      <AriaOverlayArrow>
        {(p) => (
          <svg
            width={14}
            height={8}
            className={p.placement == "bottom" ? "rotate-180" : ""}
          >
            <path d="M0 0L7 6L14 0" />
          </svg>
        )}
      </AriaOverlayArrow>
      {children}
    </Root>
  );
}

const TooltipTrigger = ({ children }: { children: React.ReactNode }) => (
  <AriaTooltipTrigger delay={100} closeDelay={100}>
    {children}
  </AriaTooltipTrigger>
);

export const WithTooltip = ({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) => {
  const canHover = useMediaQuery("(pointer: fine)");
  const Trigger = canHover ? TooltipTrigger : DialogTrigger;
  return (
    <Trigger>
      <Button className="relative after:content-[''] after:absolute after:left-[1px] after:right-[1px] after:bottom-[1px] after:h-[1px] after:bg-gradient-dashed">
        {children}
      </Button>
      <Floater canHover={canHover}>{content}</Floater>
    </Trigger>
  );
};
