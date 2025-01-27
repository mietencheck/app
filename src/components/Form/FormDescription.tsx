import { useLocalizeString } from "~/l10n";

export function FormDescription({
  description,
  className,
}: {
  description: string;
  className?: string;
}) {
  const l = useLocalizeString();
  return <p className={className}>{l(description)}</p>;
}
