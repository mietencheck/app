import { Tab as AriaTab, TabProps } from "react-aria-components";

export const Tab = (props: TabProps) => (
  <AriaTab
    className={({ isSelected }) =>
      isSelected ? "text-black" : "text-gray-400"
    }
    {...props}
  />
);
