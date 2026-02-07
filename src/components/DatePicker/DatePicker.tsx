import { parseDate, type DateValue } from "@internationalized/date";
import cx from "classnames";
import {
  Button as AriaButton,
  DatePicker as AriaDatePicker,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Popover,
} from "react-aria-components";

import { CalendarIcon } from "../Icons/Calendar";
import { ChevronRightIcon } from "../Icons/ChevronRight";

export function DatePicker({
  value,
  onChange,
  id,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}) {
  const dateValue: DateValue | null = value ? parseDate(value) : null;

  return (
    <AriaDatePicker
      id={id}
      value={dateValue}
      onChange={(next) => onChange(next ? next.toString() : "")}
    >
      <Group
        className={cx(
          "flex items-center gap-2 w-full px-4 py-3 bg-white border border-neutral rounded shadow hover:border-neutral-hover focus-within:outline-none focus-within:ring-3 focus-within:ring-primary focus-within:border-primary-solid",
          className,
        )}
      >
        <DateInput className="flex flex-1 text-base gap-0.5">
          {(segment) => (
            <DateSegment
              segment={segment}
              className={({ isPlaceholder, isFocused }) =>
                cx(
                  "",
                  isPlaceholder && "text-neutral-faded",
                  isFocused && "bg-gray-3 focus:outline-none",
                )
              }
            />
          )}
        </DateInput>
        <AriaButton
          slot="button"
          aria-label="Kalender öffnen"
          className="text-neutral-faded hover:text-neutral"
        >
          <CalendarIcon />
        </AriaButton>
      </Group>
      <Popover
        placement="bottom start"
        className="w-auto rounded border border-neutral bg-white p-3 shadow-lg"
      >
        <Dialog>
          <Calendar>
            <div className="flex items-center justify-between mb-2 px-1">
              <AriaButton
                className="p-1 text-neutral hover:text-primary"
                slot="previous"
              >
                <ChevronRightIcon className="rotate-180" />
              </AriaButton>
              <Heading className="text-sm font-500 text-center flex-1" />
              <AriaButton
                className="p-1 text-neutral hover:text-primary"
                slot="next"
              >
                <ChevronRightIcon />
              </AriaButton>
            </div>
            <CalendarGrid className="w-[280px] table-fixed text-center">
              <CalendarGridHeader className="table-header-group">
                {(day) => (
                  <CalendarHeaderCell className="h-7 text-xs font-500 text-neutral-faded uppercase">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody className="table-row-group">
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={({
                      isSelected,
                      isOutsideMonth,
                      isDisabled,
                      isFocusVisible,
                    }) =>
                      cx(
                        "h-9 w-9 rounded text-sm flex items-center justify-center",
                        isOutsideMonth && "text-neutral-faded",
                        isDisabled && "text-neutral-faded opacity-50",
                        isSelected && "bg-primary-solid text-on-primary",
                        !isSelected && "hover:bg-primary-hover",
                        isFocusVisible && "ring-2 ring-primary",
                      )
                    }
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
