import { pushUnsafe, useLocation } from "@swan-io/chicane";
import React, { useEffect, useMemo, useRef } from "react";

import { Header } from "~/components";
import { Button, LinkButton } from "~/components/ui";
import { NavBar } from "~/details/NavBar";
import { useAnswers, useMainSteps, useStarterSteps } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import { DetailPage } from "./detail";
import { IntroPage } from "./intro";
import { ListNav, NavItem, PageNavItem, SubListNav } from "./ListNav";
import { MissingFieldsPage } from "./missing";
import { buildPageIndex, getRelNavItems, useMainNavItems } from "./navigation";
import { ResultPage } from "./result";
import { DetailsRouter } from "./router";
import { SummaryPage } from "./summary";
import { useHasMissingAnswers, useIsCompleted, usePathname } from "./utils";

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const mainSteps = useMainSteps();
  const isCompleted = useIsCompleted();

  const pages = useMainNavItems(mainSteps);

  const relNav = getRelNavItems(pages, pathname);
  const pageIndex = buildPageIndex(pages, pathname);

  const l = useLocalizeField();

  return (
    <>
      <Header>
        <div className="lg:hidden">
          <NavBar pages={pages} activeItem={relNav.current?.title} />
        </div>
      </Header>
      <div className="container max-w-screen-lg flex gap-8 large:pl-5 print:p-0 print:max-w-full">
        <aside className="hidden lg:block sm:w-60 py-6 flex-shrink-0 print:hidden">
          <ListNav>
            {pages.map((page) =>
              page.children && page.children.length > 0 ? (
                <SubListNav key={page.href} item={page} />
              ) : page.title == "Auswertung" ? (
                <NavItem
                  key={page.href}
                  title={page.title}
                  href={page.href}
                  status={
                    pathname == "/details/auswertung"
                      ? "active"
                      : isCompleted
                        ? "completed"
                        : "default"
                  }
                />
              ) : (
                <PageNavItem key={page.href} page={page} />
              ),
            )}
          </ListNav>
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
              {pathname.includes("/details/auswertung")
                ? l("Ergebnis")
                : `${l("Step")} ${pageIndex}`}
            </p>
          </header>
          <div className="flex flex-col gap-8 mb-12">{children}</div>
          <div className="flex justify-end gap-4 print:hidden">
            {relNav.previous && (
              <LinkButton color="neutral" to={relNav.previous.href}>
                {l("Back")}
              </LinkButton>
            )}
            {relNav.next && (
              <Button color="primary" variant="solid" type="submit">
                {l("Next step")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default function DetailsPage() {
  const route = DetailsRouter.useRoute([
    "Intro",
    "Summary",
    "FormPage",
    "Result",
    "Missing",
  ]);

  const location = useLocation();

  const answers = useAnswers();
  const starterSteps = useStarterSteps();
  const isDoneWithStart = useMemo(
    () =>
      starterSteps.every(
        (s) => s.type != "Question" || answers.getById(s.id) !== undefined,
      ),
    [answers, starterSteps],
  );

  useEffect(() => {
    if (!isDoneWithStart) {
      window.location.href = "/";
    }
  }, [answers, isDoneWithStart, starterSteps]);

  const prevLocationRef = useRef(location.path);
  useEffect(() => {
    if (prevLocationRef.current !== location.path) {
      window.scrollTo({ top: 0 });
    }
  }, [location.path, route]);

  useEffect(() => {
    if (location.path.length == 1 && location.path[0] == "details") {
      DetailsRouter.push("Intro");
    }
  }, [location.path]);

  const hasMissingFields = useHasMissingAnswers();
  useEffect(() => {
    if (
      hasMissingFields &&
      (route?.name == "FormPage" || route?.name == "Result") &&
      location.path.at(-1) != "mietvertrag"
    ) {
      DetailsRouter.replace("Missing");
    }
  }, [hasMissingFields, location.path, route?.name]);

  if (!route) return null;
  return (
    <Layout>
      {(() => {
        switch (route.name) {
          case "Intro":
            return <IntroPage />;

          case "Summary":
            return <SummaryPage />;

          case "Missing":
            return <MissingFieldsPage />;

          case "FormPage":
            return <DetailPage />;

          case "Result":
            return <ResultPage />;

          default:
            route satisfies never;
        }
      })()}
    </Layout>
  );
}
