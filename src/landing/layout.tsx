import { Menu } from "lucide-react";
import React from "react";

import { IconButton } from "~/components";
import { LanguageSelect } from "~/components/LanguageSelect";
import { useLocaleState, useLocalizeField } from "~/l10n";

export function Layout({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = React.useState(false);
  const l = useLocalizeField();
  const { locale } = useLocaleState();
  return (
    <>
      <header
        className={`sticky left-0 right-0 top-0 ${menu ? "bg-purple-10" : "bg-purple-9"}  z-50`}
      >
        <div className="container flex justify-between items-center gap-8 py-4">
          <a href="/" className="title-16 text-yellow-11">
            mietencheck.de
          </a>
          <div className="flex flex-row gap-4 sm:gap-8">
            <div className="flex gap-6 items-center sm:hidden">
              <LanguageSelect variant="yellow" />
              <IconButton
                onPress={() => setMenu(!menu)}
                color="unstyled"
                variant="unstyled"
                size="unstyled"
                className="px-3 py-3 text-yellow-11 border-2 border-yellow-9 rounded-full focus-visible:outline-none focus-visible:border-yellow-9"
              >
                <Menu className="h-5 w-5" />
              </IconButton>
            </div>
            <nav className="hidden sm:flex gap-8 items-center">
              <div className="space-x-6">
                <a
                  href={
                    locale == "de"
                      ? "https://blog.mietencheck.de/de"
                      : "https://blog.mietencheck.de/en"
                  }
                  className="text-base-medium text-yellow-11 hover:underline"
                >
                  {l("Ratgeber")}
                </a>
                <a
                  href="/ueber-uns"
                  className="text-base-medium text-yellow-11 hover:underline"
                >
                  {l("Über Uns")}
                </a>
              </div>
              <div className="flex gap-3">
                <LanguageSelect variant="yellow" />
                <a
                  className="inline-block px-3 py-3 bg-yellow-9 text-purple-11 text-base-medium border-2 border-yellow-9 rounded-full hover:bg-yellow-10 hover:border-yellow-10"
                  href="/schnelltest"
                >
                  {l("Miete checken")}
                </a>
              </div>
            </nav>
          </div>
        </div>
        <div
          className={`${menu ? "flex" : "hidden"} container flex-col items-center text-center pb-4 space-y-1`}
        >
          <a
            href={
              locale == "de"
                ? "https://blog.mietencheck.de/de"
                : "https://blog.mietencheck.de/en"
            }
            className="block py-3 text-base-medium text-yellow-11 hover:underline"
          >
            {l("Ratgeber")}
          </a>
          <a
            href="/ueber-uns"
            className="block py-3 text-base-medium text-yellow-11 hover:underline"
          >
            {l("Über Uns")}
          </a>
          <div className="w-full py-3">
            <a
              className="block px-3 py-2.5 bg-yellow-9 text-purple-11 text-base-medium border-2 border-yellow-9 rounded-full hover:bg-yellow-10 hover:border-yellow-10"
              href="/schnelltest"
            >
              {l("Miete checken")}
            </a>
          </div>
        </div>
      </header>
      <main>
        {children}
        <section className="bg-yellow-9">
          <div className="container py-20 sm:py-24 space-y-16 text-center">
            <h2 className="title-32 sm:title-36 md:title-40 lg:title-44 text-purple-11">
              {l("Check jetzt deine Miete!")} <br className="hidden sm:block" />
              {l("Kostenlos und sicher.")}
            </h2>
            <a
              className="inline-block px-5 py-3 bg-purple-9 text-yellow-11 text-xl-book rounded-full hover:bg-purple-10"
              href="/schnelltest"
            >
              {l("Miete checken")}
            </a>
          </div>
        </section>
      </main>
      <footer className="bg-purple-11">
        <div className="container py-20 sm:py-24 flex flex-col items-center space-y-16">
          <div className="flex flex-wrap gap-4 justify-center sm:gap-6">
            {[
              {
                label: l("Ratgeber"),
                href:
                  locale == "de"
                    ? "https://blog.mietencheck.de/de"
                    : "https://blog.mietencheck.de/en",
              },
              { label: l("Über Uns"), href: "/ueber-uns" },
              {
                label: l("Mitmachen"),
                href: "https://dwenteignen.de/mitmachen",
                target: "_blank",
              },
              { label: l("Kontakt"), href: "mailto:mitmachen@dwenteignen.de" },
            ].map((item) => (
              <a
                key={item.label}
                className="inline-block flex-shrink-0 px-4 py-2.5 bg-yellow-9 text-purple-11 text-base-book rounded-full hover:bg-yellow-10 sm:text-lg-book"
                target={item.target ? item.target : ""}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a href="https://dwenteignen.de/" target="_blank">
            <img
              src="images/dwe-logo-yellow.svg"
              alt="Deutsche Wohnen & Co Enteignen Logo"
              className="h-16"
            />
          </a>
        </div>
        <div className="bg-purple-10">
          <div className="container py-8 text-center space-x-8">
            <a
              className="text-base-medium text-yellow-11 hover:underline"
              href="/datenschutz"
            >
              {l("Datenschutz")}
            </a>
            <a
              className="text-base-medium text-yellow-11 hover:underline"
              href="impressum"
            >
              {l("Impressum")}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
