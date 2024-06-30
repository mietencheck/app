import { autoPlacement, size, useFloating } from "@floating-ui/react-dom";
import { useCombobox, UseComboboxProps } from "downshift";
import { useMemo, useState } from "react";
import { VisuallyHidden } from "react-aria";
import { flushSync } from "react-dom";
import { omit, sortBy, unique, uniqueBy } from "remeda";
import useSWRImmutable from "swr/immutable";

import {
  Label,
  LIST_BOX_CLASS_NAME,
  LISTBOX_ITEM_CLASS_NAME,
  TextField,
} from "~/components/ui";
import type { Adresse, AdresseFormValue } from "~/form/adresse/types";
import { useLocalizeField } from "~/l10n";
import { formatAddresse } from "~/utils";

import { extractNummerQuery, fetchStrasseData, strassenIndex } from "./search";

type ComboBoxProps<Item> = {
  items: Item[];
  itemToKey: (item: Item) => string | null;
  itemToLabel?: (item: Item | null) => string;
  itemToInputValue?: (item: Item | null) => string;
  // Workaround for downshift-js/downshift#1108
  onInputValueChange?: (value: string) => void;
  onInputBlur?: () => void;
} & Omit<UseComboboxProps<Item>, "items" | "onInputValueChange">;

function ComboBox<Item>({
  items,
  itemToKey,
  itemToLabel,
  itemToInputValue,
  inputValue: inputValueProp,
  onInputValueChange,
  ...props
}: ComboBoxProps<Item>) {
  const inputValue = inputValueProp ?? "";

  const itemToString: ((item: Item | null) => string) | undefined = (item) =>
    itemToInputValue?.(item) ??
    itemToLabel?.(item) ??
    (item ? itemToKey?.(item) ?? "" : "");
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    inputValue,
    items,
    itemToString,
    ...props,
  });

  const [maxHeight, setMaxHeight] = useState(300);
  const { refs, floatingStyles } = useFloating({
    middleware: [
      size({
        apply({ availableHeight }) {
          flushSync(() => setMaxHeight(availableHeight));
        },
      }),
      autoPlacement(),
    ],
  });

  return (
    <>
      <div className="flex flex-col gap-1">
        <div
          className={[
            "flex w-full px-4 py-3 font-450 bg-white border border-gray-7",
            "rounded shadow hover:border-gray-8 focus-within:ring-3",
            "focus-within:ring-primary focus-within:border-primary-solid",
            "focus-within:hover:border-primary-solid",
          ].join(" ")}
        >
          <input
            className="w-full focus-visible:outline-none"
            {...getInputProps({
              required: true,
              onChange(event) {
                if ("value" in event.target) {
                  const { value } = event.target;
                  onInputValueChange?.(value);
                }
              },
              onBlur() {
                props.onInputBlur?.();
              },
            })}
          />
          <button
            aria-label="toggle menu"
            className=""
            type="button"
            {...getToggleButtonProps()}
          />
        </div>
      </div>
      <div className="relative">
        <ul
          {...getMenuProps({
            ref: refs.setFloating,
            style: { ...floatingStyles, maxHeight },
            className: `overflow-auto ${LIST_BOX_CLASS_NAME} ${
              !(isOpen && items.length) && "hidden"
            }`,
          })}
        >
          {isOpen &&
            items.map((item, index) => (
              <li
                key={itemToKey(item)}
                className={[
                  highlightedIndex === index && "bg-purple-9 text-white",
                  selectedItem === item && "",
                  LISTBOX_ITEM_CLASS_NAME,
                ].join(" ")}
                {...getItemProps({ item, index })}
              >
                {(itemToLabel ?? itemToKey)(item)}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

function LabeledComboBox<Item>({
  className,
  title,
  ...props
}: { className?: string; title: string } & ComboBoxProps<Item>) {
  return (
    <div className={"flex flex-col gap-1.5 " + (className || "")}>
      <Label>{title}</Label>
      <ComboBox<Item> {...props} />
    </div>
  );
}

function splitHausnummer(value: string) {
  const result = value.split(/(\d+)/);
  return { numeric: Number(result.at(1)), textual: result.at(2) };
}

export function AdresseForm({
  id,
  value: adresse,
  onChange,
}: {
  id: string;
  value: AdresseFormValue | null;
  onChange: (value: AdresseFormValue | null) => void;
}) {
  const [strasseQuery, nummerQuery] = useMemo(
    () => extractNummerQuery(adresse?.strasse ?? ""),
    [adresse?.strasse],
  );
  const strassenMatches = useMemo(
    () => strassenIndex.search(strasseQuery, { limit: 10 }).map((s) => `${s}`),
    [strasseQuery],
  );
  const { data: adressen } = useSWRImmutable(
    ["strasse", adresse?.strasse],
    async () =>
      (
        await Promise.all(strassenMatches.map((s) => fetchStrasseData(s)))
      ).flat(),
  );

  const strasseItems = useMemo(() => {
    if (adressen && adressen.length > 0) {
      if (nummerQuery != null) {
        return [
          ...adressen.filter((a) =>
            a.nummer.toLowerCase().startsWith(nummerQuery.toLowerCase()),
          ),
          ...uniqueBy(adressen, (a) => a.plz)
            .filter(({ plz }) => plz.startsWith(nummerQuery))
            .map(({ strasse, plz }) => ({ strasse, plz })),
        ];
      }
      return uniqueBy(adressen, (a) => `${a.plz}:${a.strasse}`).map((a) =>
        omit(a, ["nummer"]),
      );
    }
    return strassenMatches.map((strasse) => ({ strasse, plz: "" }));
  }, [adressen, nummerQuery, strassenMatches]);
  const nummerItems = useMemo(
    () => [
      ...new Set(
        sortBy(
          (adressen ?? [])
            .map((a) => a.nummer)
            .filter((nummer) =>
              nummer
                .toLowerCase()
                .startsWith((adresse?.nummer ?? "").toLowerCase()),
            ),
          (s) => splitHausnummer(s).numeric,
          (s) => splitHausnummer(s).textual ?? "",
        ),
      ),
    ],
    [adresse?.nummer, adressen],
  );
  const plzItems = useMemo(
    () => unique(adressen?.map((a) => a.plz) ?? []),
    [adressen],
  );
  const handleChange = async (adresse: AdresseFormValue) => {
    const lage = adressen?.find(
      (a) =>
        a.plz == adresse?.plz?.trim() &&
        a.strasse == adresse?.strasse?.trim() &&
        a.nummer == adresse?.nummer?.trim(),
    )?.lage;
    onChange({ ...adresse, lage });
  };

  const l = useLocalizeField();

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <LabeledComboBox<Partial<Adresse>>
          id={id}
          className="w-full"
          title={l("street")}
          items={strasseItems}
          itemToKey={(i) => JSON.stringify(i)}
          itemToInputValue={(i) => i?.strasse ?? ""}
          itemToLabel={(i) => (i ? formatAddresse(i) : "")}
          inputValue={adresse?.strasse}
          onInputValueChange={(strasse) =>
            handleChange({ ...adresse, strasse })
          }
          onInputBlur={() => {
            const strassen = strasseItems.map((s) => s.strasse);
            if (
              strassen.length > 0 &&
              strassen.every((s) => s == strassen[0])
            ) {
              handleChange({ ...adresse, strasse: strassen[0] });
            }
          }}
          onSelectedItemChange={({ selectedItem }) => {
            handleChange({ ...adresse, ...selectedItem });
          }}
        />
        <LabeledComboBox<string>
          title={l("street_no")}
          items={nummerItems}
          itemToKey={(i) => i}
          inputValue={adresse?.nummer}
          onInputValueChange={(inputValue) => {
            handleChange({ ...adresse, nummer: inputValue ?? "" });
          }}
          onInputBlur={() => {
            handleChange({
              ...adresse,
              nummer: (adresse?.nummer ?? "").trim(),
            });
          }}
          onSelectedItemChange={({ selectedItem }) => {
            handleChange({ ...adresse, nummer: selectedItem ?? "" });
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <LabeledComboBox<string>
          title={l("zip_code")}
          items={plzItems}
          itemToKey={(i) => i}
          inputValue={adresse?.plz}
          onInputValueChange={(inputValue) => {
            handleChange({ ...adresse, plz: inputValue ?? "" });
          }}
          onInputBlur={() => {
            handleChange({
              ...adresse,
              plz: (adresse?.plz ?? "").trim(),
            });
          }}
          onSelectedItemChange={({ selectedItem }) => {
            handleChange({ ...adresse, plz: selectedItem ?? "" });
          }}
        />
        <div className="w-full flex flex-col gap-1.5">
          <Label htmlFor="stadt">{l("city")}</Label>
          <TextField
            id="stadt"
            aria-label={l("city")}
            isRequired
            defaultValue="Berlin"
            pattern="Berlin"
            title="Berlin"
          />
        </div>
      </div>
      {adresse?.plz && adresse?.strasse && adresse.nummer && !adresse?.lage && (
        <div className="mt-4 flex flex-col text-red-9">
          {l(
            "Wir konnten keine Informationen zu der angegebenen Adresse finden, bitte überprüfe deine Angaben.",
          )}
          <div className="mx-auto">
            <VisuallyHidden>
              <input
                type="text"
                required
                defaultValue="Yarp"
                pattern="Narp"
                title="Adresse nicht gefunden"
              />
            </VisuallyHidden>
          </div>
        </div>
      )}
    </>
  );
}
