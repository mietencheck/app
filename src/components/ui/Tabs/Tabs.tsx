import { cva, cx } from "cva";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  TabPanelProps as AriaTabPanelProps,
  TabProps as AriaTabProps,
  Tabs as AriaTabs,
  TabsProps as AriaTabsProps,
  composeRenderProps,
} from "react-aria-components";

export function Tabs(props: AriaTabsProps) {
  return <AriaTabs {...props} />;
}

export function TabList<T extends object>({
  className,
  ...props
}: AriaTabListProps<T>) {
  return <AriaTabList className={cx("flex gap-6", className)} {...props} />;
}

export function TabPanel(props: AriaTabPanelProps) {
  return <AriaTabPanel {...props} />;
}

const tabStyles = cva(
  "flex items-center py-5 border-b-2 hover:cursor-pointer focus:outline-none",
  {
    variants: {
      isSelected: {
        false: "text-neutral-faded border-transparent hover:text-neutral ",
        true: "text-neutral border-primary-solid hover:border-primary-solid-hover",
      },
    },
  },
);

export function Tab({ className, ...props }: AriaTabProps) {
  return (
    <AriaTab
      className={composeRenderProps(className, (className, renderProps) =>
        tabStyles({ ...renderProps, className }),
      )}
      {...props}
    />
  );
}
