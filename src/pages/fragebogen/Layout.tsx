import { pushUnsafe } from "@swan-io/chicane";

import { Button, Link } from "~/components";
import { FragebogenHeader } from "~/components/Header";
import { useDetailsSteps } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import {
  Navigation,
  NavigationGroup,
  NavigationItem,
  NavigationPageItem,
} from "./components/Navigation";
import {
  buildPageIndex,
  getRelNavItems,
  useMainNavItems,
} from "./components/Navigation/utils";
import { useIsCompleted, usePathname } from "./utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const mainSteps = useDetailsSteps();
  const isCompleted = useIsCompleted();

  const pages = useMainNavItems(mainSteps);

  const relNav = getRelNavItems(pages, pathname);
  const pageIndex = buildPageIndex(pages, pathname);

  const l = useLocalizeField();

  return (
    <>
      <FragebogenHeader />
      <div className="container max-w-screen-lg flex gap-8 large:pl-5 print:p-0 print:max-w-full">
        <aside className="hidden lg:block sm:w-60 py-6 flex-shrink-0 print:hidden">
          <Navigation>
            {pages.map((page) =>
              page.children && page.children.length > 0 ? (
                <NavigationGroup key={page.href} item={page} />
              ) : page.title == "Auswertung" ? (
                <NavigationItem
                  key={page.href}
                  title={page.title}
                  href={page.href}
                  status={
                    pathname == "/fragebogen/auswertung"
                      ? "active"
                      : isCompleted
                        ? "completed"
                        : "default"
                  }
                />
              ) : (
                <NavigationPageItem key={page.href} page={page} />
              ),
            )}
          </Navigation>
        </aside>
        <form
          className="py-6 sm:py-8 flex flex-grow flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (relNav.next) {
              pushUnsafe(relNav.next.href);
            }
          }}
        >
          <header className="space-y-2 print:hidden mb-2">
            <p className="text-base text-gray-11">
              {pathname.includes("/fragebogen/auswertung")
                ? l("Ergebnis")
                : `${l("Step")} ${pageIndex}`}
            </p>
          </header>
          <div className="flex flex-col gap-8 mb-12">{children}</div>
          <div className="flex justify-end gap-4 print:hidden">
            {relNav.previous && (
              <Link variant="outline" href={relNav.previous.href}>
                {l("Back")}
              </Link>
            )}
            {relNav.next && (
              <Button variant="solid" type="submit">
                {l("Next step")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
