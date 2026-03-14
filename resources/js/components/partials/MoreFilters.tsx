import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { FieldSeparator } from "../ui/field"
import { Input } from "../ui/input"
import { DatePickerGloabal } from "./DatePicker"
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa"
import { useCallback, useEffect, useState } from "react"
import { exportToPdfOrExcel, useGlobalStore } from "@/hooks/backoffice"
import { FieldConfig, PaletteProps } from "@/lib/utils"
import { FieldRenderer } from "@/lib/utilsFunctiions"

export function MoreFilters({
  type,
  open,
  onOpenChange,
  data,
  setData,
  handleSubmit,
  reset,
  fields,
  palette
}: {
  fields      ?: FieldConfig[]
  type         : string
  open         : boolean
  onOpenChange : (open: boolean) => void
  data         : any
  setData      : (data: any) => void
  handleSubmit : any
  reset        : any
  palette      : PaletteProps
}) {

  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd]     = useState("")

  // ─── Sync dates → data ────────────────────────────

  useEffect(() => {
    if (dateStart.trim().length > 0) setData({ ...data, date_start: dateStart })
  }, [dateStart])

  useEffect(() => {
    if (dateEnd.trim().length > 0) setData({ ...data, date_end: dateEnd })
  }, [dateEnd])

  // ─── Handlers ─────────────────────────────────────

  const handleChange = useCallback((name: string, value: any) => {
    setData({ ...data, [name]: value })
  }, [data, setData])

  const handleReset = useCallback(() => {
    setDateStart("")
    setDateEnd("")
    reset()
  }, [reset])

  const hasCustomFields = fields && Array.isArray(fields) && fields.length > 0
  const showDefaultFields = !hasCustomFields

  // ─── Styles ───────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    background: palette?.bg,
    border    : `1px solid ${palette?.border}`,
    color     : palette?.textActive,
  }

  const btnStyle = (color?: string): React.CSSProperties => ({
    background: "transparent",
    border    : `1px solid ${palette?.border}`,
    color     : color ?? palette?.text,
    height    : 36,
    padding   : "0 16px",
    borderRadius: 6,
    fontSize  : 13,
    cursor    : "pointer",
    transition: "all 0.15s",
    display   : "flex",
    alignItems: "center",
    gap       : 6,
  })

  return (
    <Drawer
      open={open}
      onOpenChange={() => onOpenChange(open)}
      direction="right"
    >
      <DrawerContent
        className="h-full w-full sm:w-[400px] sm:max-w-[50vw] !max-w-[30vw]"
        style={{
          background: palette?.bgActive,
          border    : `1px solid ${palette?.border}`,
        }}
      >


      {/* ── Header ── */}
      <DrawerHeader>
        <DrawerTitle style={{ color: palette?.textActive }}>
          Autres Filtres
        </DrawerTitle>
        <DrawerDescription style={{ color: palette?.text }}>
          Vous pouvez appliquer d'autres filtres si besoin !
        </DrawerDescription>
        <FieldSeparator />
      </DrawerHeader>

      {/* ── Body ── */}
      <div className="no-scrollbar overflow-y-auto px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
          className="space-y-4"
        >
          {/* Champs par défaut */}
          {showDefaultFields && (
            <div className="space-y-4">
              <Input
                type="text"
                className="[&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
                style={inputStyle}
                value={data?.search ?? ""}
                onChange={(e) => setData({ ...data, search: e.target.value })}
                placeholder="Rechercher par libelle, description ..."
              />
              <DatePickerGloabal
                name="date_start"
                fieldLabel="Créé entre le :"
                value={dateStart}
                onSelect={(t) => setDateStart(t)}
              />
              <DatePickerGloabal
                name="date_end"
                fieldLabel="Et le :"
                value={dateEnd}
                onSelect={(t) => setDateEnd(t)}
              />
            </div>
          )}

          {/* Champs custom */}
          {hasCustomFields && (
            <div className="grid grid-cols-12 gap-y-6">
              {fields!.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={data[field.name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          )}

          {/* Export */}
          <div
            className="flex gap-2 items-center mt-10 justify-end pt-4"
            style={{ borderTop: `1px solid ${palette?.border}` }}
          >
            <span className="text-xs mr-1" style={{ color: palette?.text }}>
              Exporter en
            </span>

            <button
              type="button"
              style={btnStyle()}
              onClick={() => exportToPdfOrExcel(type, "excel", data)}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette?.bgHover ?? "" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
            >
              <FaRegFileExcel className="" style={{ color: palette.success }} />
              Excel
            </button>

            <button
              type="button"
              style={btnStyle()}
              onClick={() => exportToPdfOrExcel(type, "pdf", data)}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette?.bgHover ?? "" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
            >
              <FaRegFilePdf className="text-red-400" />
              Pdf
            </button>
          </div>
        </form>
      </div>

      {/* ── Footer ── */}
      <DrawerFooter
        className="flex flex-row gap-2 pt-4"
        style={{ borderTop: `1px solid ${palette?.border}` }}
      >
        <button
          type="button"
          className="flex-1"
          style={{
            ...btnStyle(),
            background: palette?.accent,
            border    : "none",
            color     : "#fff",
            justifyContent: "center",
          }}
          onClick={handleSubmit}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85" }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
        >
          Filtrer
        </button>

        <button
          type="button"
          className="flex-1"
          style={{ ...btnStyle(), justifyContent: "center" }}
          onClick={handleReset}
          onMouseEnter={(e) => { e.currentTarget.style.background = palette?.bgHover ?? "" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
        >
          Annuler
        </button>
      </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}