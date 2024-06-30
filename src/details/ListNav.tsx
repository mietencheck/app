import { Link } from "@swan-io/chicane";
import cx from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-aria-components";

import { StatusIcon, StatusIconProps } from "~/components/ui";
import { NavItemData } from "~/details/navigation";
import { useLocalizeString } from "~/l10n";

import { ChevronDownIcon } from "../components/ui/Icons/ChevronDown";
import {
  useCheckIsGroupCompleted,
  useHasMissingAnswers,
  usePathname,
} from "./utils";

type ListNavigationProps = {
  children: React.ReactNode;
};

export function ListNav({ children }: ListNavigationProps) {
  return <ul className="sticky top-[98px] print:hidden">{children}</ul>;
}

export function NavItem({
  title,
  href,
  status,
}: {
  title: string;
  href: string;
  status: StatusIconProps["status"];
}) {
  const pathname = usePathname();
  const l = useLocalizeString();
  return (
    <li>
      <Link
        to={href}
        className={cx(
          "border border-transparent rounded px-3 py-1.5",
          "flex items-center gap-2",
          "hover:bg-gray-2 focus-visible:outline-none focus-visible:ring-3",
          "focus-visible:ring-purple-7/50 focus-visible:border-primary-solid",
        )}
      >
        <StatusIcon status={status} />
        <span
          className={
            pathname == decodeURI(href) ? "text-base-medium" : "text-base"
          }
        >
          {l(title)}
        </span>
      </Link>
    </li>
  );
}

export function PageNavItem({ page }: { page: NavItemData }) {
  const pathname = usePathname();
  const checkIsActive = (href: string) => pathname == decodeURI(href);
  const checkIsGroupCompleted = useCheckIsGroupCompleted();
  const isGroupCompleted = useMemo(
    () => checkIsGroupCompleted(page),
    [checkIsGroupCompleted, page],
  );
  const hasMissingAnswers = useHasMissingAnswers();
  return (
    <NavItem
      title={page.title}
      href={page.href}
      status={
        checkIsActive(page.href)
          ? "active"
          : isGroupCompleted ||
              (page.href == "/details/fehlende-angaben" && !hasMissingAnswers)
            ? "completed"
            : "default"
      }
    />
  );
}

export function SubListNav({ item }: { item: NavItemData }) {
  const pathname = usePathname();
  const l = useLocalizeString();
  const checkIsActive = (href: string) => pathname == decodeURI(href);

  const isChildActive = item.children?.some(({ href }) => checkIsActive(href));
  const [open, setOpen] = useState(isChildActive);
  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const checkIsGroupCompleted = useCheckIsGroupCompleted();
  const isCompleted = useMemo(
    () => item.children?.every((i) => checkIsGroupCompleted(i)),
    [checkIsGroupCompleted, item.children],
  );

  return (
    <li>
      <Button
        className="w-full flex items-center px-3 py-1.5 gap-2 border border-transparent rounded hover:bg-gray-2 focus-visible:outline-none"
        onPress={() => setOpen(!open)}
      >
        <StatusIcon
          status={
            pathname.includes(item.href)
              ? "active"
              : isCompleted
                ? "completed"
                : "default"
          }
        />
        {l(item.title)}
        <ChevronDownIcon
          className={`text-gray-11 hover:text-gray-12 ${
            open ? "transform rotate-180" : ""
          }`}
        />
      </Button>
      {open && (
        <ul className="ml-7">
          {item.children?.map((subpage) => (
            <PageNavItem key={subpage.href} page={subpage} />
          ))}
        </ul>
      )}
    </li>
  );
}
