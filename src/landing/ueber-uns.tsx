import { useLocalizeField } from "~/l10n";

import { Layout } from "./layout";

export function UeberUnsPage() {
  const l = useLocalizeField();

  return (
    <Layout>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-purple-11 text-center">
            <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
              {l("Über Uns")}
            </span>
          </h2>
          <p className="max-w-prose text-lg text-purple-11 mx-auto text-center">
            {l("Über Uns Text")}
          </p>
        </div>
      </section>
      <section>
        <div className="container py-20 space-y-20 sm:py-24 sm:space-y-24">
          <h2 className="flex flex-col items-center gap-y-2 title-32 sm:title-36 md:title-40 lg:title-44 text-purple-11 text-center transform -rotate-6">
            <span className="w-fit px-4 py-3 bg-yellow-9 text-purple-11">
              {l("Was uns motiviert")}
            </span>
          </h2>
          <div className="flex flex-col gap-10 max-w-[960px] mx-auto text-purple-11">
            {[
              {
                title: l("Motivation 1 Titel"),
                text1: l("Motivation 1 Text"),
              },
              {
                title: l("Motivation 2 Titel"),
                text1: l("Motivation 2 Text"),
              },
              {
                title: l("Motivation 3 Titel"),
                text1: l("Motivation 3 Text"),
              },
              {
                title: l("Motivation 4 Titel"),
                text1: l("Motivation 4 Text"),
              },
              {
                title: l("Motivation 5 Titel"),
                text1: l("Motivation 5 Text 1"),
                text2: l("Motivation 5 Text 2"),
              },
              {
                title: l("Motivation 6 Titel"),
                text1: l("Motivation 6 Text 1"),
                text2: l("Motivation 6 Text 2"),
              },
              {
                title: l("Motivation 7 Titel"),
                text1: l("Motivation 7 Text"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col md:flex-row gap-6 md:gap-10"
              >
                <h3 className="w-full heading-24">{item.title}</h3>
                <div className="w-full  text-lg space-y-3">
                  <p>{item.text1}</p>
                  {item.text2 && <p>{item.text2}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
