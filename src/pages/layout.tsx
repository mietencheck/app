import { Link } from "~/components";
import { MarketingHeader } from "~/components/Header";
import { useLocalizeField } from "~/l10n";

export function Layout({
  children,
  subheader,
}: {
  children: React.ReactNode;
  subheader?: React.ReactNode;
}) {
  const l = useLocalizeField();

  return (
    <>
      <MarketingHeader />
      {subheader}
      <main>
        {children}
        <section className="bg-purple-9">
          <div className="container py-20 sm:py-24 space-y-20 text-center">
            <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-white">
              {l("Check jetzt deine Miete!")} <br className="hidden sm:block" />
              {l("Kostenlos und sicher.")}
            </h2>
            <Link
              variant="solid"
              color="red"
              href="/schnelltest"
              size="lg"
              className="text-lg"
            >
              Jetzt Miete checken
            </Link>
          </div>
        </section>
      </main>
      <footer className="bg-blue-9">
        <div className="container py-8 text-center space-x-8">
          <Link href="/datenschutz" className="text-white">
            {l("Datenschutz")}
          </Link>
          <Link href="/impressum" className="text-white">
            {l("Impressum")}
          </Link>
        </div>
      </footer>
    </>
  );
}
