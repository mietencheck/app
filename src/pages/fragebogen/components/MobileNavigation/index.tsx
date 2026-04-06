import { useLocation } from "@swan-io/chicane";
import { useMeasure } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Button, DialogTrigger, Popover } from "react-aria-components";

import { LIST_BOX_CLASS_NAME } from "~/components";
import { ChevronDownIcon } from "~/components/Icons/ChevronDown";

import { NavigationGroup, NavigationPageItem } from "../Navigation";
import type { PageNavigationItemData } from "../Navigation/utils";

export const MobileNavigation = ({
  pages,
  activeItem,
}: {
  pages: PageNavigationItemData[];
  activeItem?: string;
}) => {
  const [ref, { width }] = useMeasure();

  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className={`${LIST_BOX_CLASS_NAME} py-3 px-4`} ref={ref}>
        <span className="inline-block float-left">
          {activeItem ?? "Navigation"}
        </span>
        <ChevronDownIcon className="inline-block float-right" />
      </Button>
      <Popover>
        <ul className={LIST_BOX_CLASS_NAME} style={width ? { width } : {}}>
          {pages.map((page) =>
            page.children && page.children.length > 0 ? (
              <NavigationGroup key={page.href} item={page} />
            ) : (
              <NavigationPageItem key={page.href} page={page} />
            ),
          )}
        </ul>
      </Popover>
    </DialogTrigger>
  );
};
