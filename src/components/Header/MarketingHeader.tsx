import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button, Link } from "~/components";
import { useLocaleState, useLocalizeField } from "~/l10n";
import { AppRouter } from "~/router";

import { Header } from "./Header";
import { LanguageSelect } from "./LanguageSelect";

const aboutHref =
  "https://www.jura.fu-berlin.de/fachbereich/einrichtungen/zivilrecht/lehrende/roedlf/Mieten-Law-Clinic/index.html";

export function MarketingHeader() {
  const [menu, setMenu] = useState(false);
  const { locale } = useLocaleState();
  const l = useLocalizeField();

  const blogHref = locale === "en" ? AppRouter.BlogEn() : AppRouter.BlogDe();
  const closeMenu = () => setMenu(false);

  return (
    <Header
      mobileMenu={
        menu ? (
          <nav
            aria-label="Navigation"
            className="absolute bg-white z-50 container flex flex-col gap-2 pb-6 sm:hidden"
          >
            <Link href={blogHref} variant="ghost" onClick={closeMenu}>
              {l("Ratgeber")}
            </Link>
            <Link
              href={aboutHref}
              variant="ghost"
              target="_blank"
              onClick={closeMenu}
            >
              Über Uns
            </Link>
            <Link
              href="/schnelltest"
              variant="solid"
              className="mt-2"
              onClick={closeMenu}
            >
              {l("Miete checken")}
            </Link>
          </nav>
        ) : null
      }
      actions={
        <>
          <div className="flex gap-1">
            <Link href={blogHref} variant="ghost" className="hidden sm:block">
              {l("Ratgeber")}
            </Link>
            <Link
              href={aboutHref}
              variant="ghost"
              className="hidden sm:block"
              target="_blank"
            >
              Über Uns
            </Link>
          </div>

          <LanguageSelect />
          <Button
            onClick={() => setMenu(!menu)}
            size="icon"
            variant="solid"
            aria-expanded={menu}
            aria-label={menu ? "Menü schließen" : "Menü öffnen"}
            className="sm:hidden"
          >
            {menu ? <X /> : <Menu />}
          </Button>
          <Link href="/schnelltest" variant="solid" className="hidden sm:block">
            {l("Miete checken")}
          </Link>
        </>
      }
    />
  );
}
