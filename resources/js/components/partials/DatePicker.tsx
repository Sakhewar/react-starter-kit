"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { fr } from "date-fns/locale"

function formatDate(date: Date | undefined)
{
  if (!date)
  {
    return ""
  }

  return date.toLocaleDateString("fr-FR",
  {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DatePickerGloabal({fieldLabel, name, value, onSelect}:{fieldLabel:string, name?:string, value:string, onSelect?: (date: any) => void})
{
  const [open, setOpen] = React.useState(false)

  return (
    <Field className="mx-auto w-full">
      <FieldLabel htmlFor="date-required">{fieldLabel}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={name ?? "date-required"}
          value={value}
          placeholder="dd/mm/yyyy"
          readOnly
          onKeyDown={(e) => {
            if (e.key === "ArrowDown")
            {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                locale={fr}
                onSelect={(date) =>
                {
                  if(onSelect)
                  {
                    onSelect(formatDate(date));
                  }
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
