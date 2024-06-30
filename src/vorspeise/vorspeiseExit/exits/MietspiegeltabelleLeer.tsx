import { useLocalizeField } from "~/l10n";

export function MietspiegeltabelleLeer() {
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        {l("Exit MietspiegeltabelleLeer Titel")}
      </h2>
      <div className="space-y-3">
        <p className="text-neutral-faded">
          {l("Exit MietspiegeltabelleLeer Text 1")}
        </p>
        <p className="text-base-book">
          {l("Exit MietspiegeltabelleLeer Text 2")}
        </p>
        <p className="text-neutral-faded">
          {l("Exit MietspiegeltabelleLeer Text 3")}
        </p>
        <a className="inline-block underline" href="TODO">
          {l("Mehr Informationen")}
        </a>
      </div>
    </>
  );
}
