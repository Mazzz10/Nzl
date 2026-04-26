"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // Increased cell size from 2.75rem → 3.25rem for more breathing room
        "bg-background group/calendar p-0 [--cell-size:3.25rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          // Increased gap between the two months
          "relative flex flex-col items-start gap-8 md:flex-row md:items-start md:gap-10",
          defaultClassNames.months
        ),
        month: cn(
          "flex w-auto flex-col gap-4 rounded-xl border border-border/40 bg-background/70 p-2",
          defaultClassNames.month
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-bold",
          captionLayout === "label"
            // Larger, bolder month+year heading like in Image 1
            ? "text-[1.45rem] tracking-tight leading-none"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",

        // More spacing below the weekday row divider
        weekdays: cn(
          "mb-2 flex gap-2 border-b border-border/60 pb-3",
          defaultClassNames.weekdays
        ),

        weekday: cn(
          // Slightly larger, clear day-of-week labels (Su Mo Tu…)
          "text-foreground/70 flex-1 select-none rounded-md text-[0.92rem] font-semibold text-center",
          defaultClassNames.weekday
        ),

        // More vertical gap between weeks
        week: cn("mt-2 flex w-full gap-2", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative h-[--cell-size] flex-1 select-none p-0 text-center text-foreground/95 [&:first-child[data-selected=true]_button]:rounded-l-lg [&:last-child[data-selected=true]_button]:rounded-r-lg",
          defaultClassNames.day
        ),
        range_start: cn("rounded-l-lg", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-lg", defaultClassNames.range_end),
        today: cn(
          "rounded-lg data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-foreground/20 aria-selected:text-foreground/20",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-40",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const customModifiers = modifiers as Record<string, boolean>

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-outside={modifiers.outside}
      data-active-check-in={customModifiers.activeCheckIn}
      data-active-check-out={customModifiers.activeCheckOut}
      className={cn(
        // ── Selection colours: BLUE to match website palette ───────────────
        // Single selected day
        "data-[selected-single=true]:bg-blue-600 data-[selected-single=true]:text-white",
        // Range start / end — filled blue circles
        "data-[range-start=true]:bg-blue-600 data-[range-start=true]:text-white",
        "data-[range-end=true]:bg-blue-600 data-[range-end=true]:text-white",
        // Range middle — very light blue tint
        "data-[range-middle=true]:bg-blue-100 data-[range-middle=true]:text-blue-900",
        // Active-field ring: stronger outer highlight for clear visibility.
        "data-[active-check-in=true]:ring-4 data-[active-check-in=true]:ring-blue-900 data-[active-check-in=true]:ring-offset-2 data-[active-check-in=true]:ring-offset-background data-[active-check-in=true]:scale-105",
        "data-[active-check-out=true]:ring-4 data-[active-check-out=true]:ring-blue-900 data-[active-check-out=true]:ring-offset-2 data-[active-check-out=true]:ring-offset-background data-[active-check-out=true]:scale-105",
        // Active-field weight: first day bold for Check In, second day bold for Check Out.
        "data-[active-check-in=true]:font-bold data-[active-check-out=true]:font-bold",
        "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50",
        // Hover
        "hover:bg-blue-50",
        // Make outside-month days clearly secondary and non-interactive.
        "data-[outside=true]:text-foreground/20 data-[outside=true]:font-medium data-[outside=true]:opacity-75 data-[outside=true]:hover:bg-transparent data-[outside=true]:pointer-events-none",
        // ── Layout ─────────────────────────────────────────────────────────
        "mx-auto inline-flex h-[--cell-size] w-[--cell-size] min-w-[--cell-size] items-center justify-center rounded-full px-0",
        // Keep numbers readable; active date gets bold via active modifiers.
        "tabular-nums text-[1.05rem] font-medium leading-none",
        "transition-colors",
        "data-[range-end=true]:rounded-full",
        "data-[range-middle=true]:rounded-md",
        "data-[range-start=true]:rounded-full",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
