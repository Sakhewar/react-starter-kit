import { useRef } from "react";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import * as Icons from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { PaletteColors } from "@/lib/utils";
import listofFilters from "@/configs/listOfFilters";

interface FilterBarProps {
  attributeName  : string;
  data           : { search: string };
  setData        : (data: { search: string }) => void;
  onSubmit       : () => void;
  onReset        : () => void;
  onExportExcel  : () => void;
  onExportPdf    : () => void;
  onMoreFilters  : () => void;
  searchInputRef?: React.Ref<HTMLInputElement>;   
}

export function FilterBar({
  attributeName,
  data,
  setData,
  onSubmit,
  onReset,
  onExportExcel,
  onExportPdf,
  onMoreFilters,
  searchInputRef,
}: FilterBarProps) {

  const btn = (
    onClick    : () => void,
    children   : React.ReactNode,
    extraStyle?: React.CSSProperties
  ) => (
    <button
      type         = "button"
      onClick      = {onClick}
      className    = "flex items-center gap-1.5 h-8 px-2 text-xs rounded-md transition-all"
      style        = {{ color: PaletteColors().text, background: "transparent", ...extraStyle }}
      onMouseEnter = {(e) => {
        e.currentTarget.style.background = PaletteColors().bgHover
        e.currentTarget.style.color      = PaletteColors().textActive
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
        e.currentTarget.style.color      = extraStyle?.color ?? PaletteColors().text
      }}
    >
      {children}
    </button>
  )

  return (
    <Card
      className = "shadow-sm py-2 rounded-[7px]"
      style     = {{
        background: PaletteColors().bgActive,
        border    : `1px solid ${PaletteColors().border}`,
      }}
    >
      <CardContent className = "flex px-3 justify-between items-center gap-3 flex-wrap">

        {/* Recherche */}
        <div className = "flex flex-1 gap-2 items-center min-w-0">
          <form
            onSubmit  = {(e) => { e.preventDefault(); onSubmit(); }}
            className = "flex flex-1 min-w-0"
          >
            <div className = "relative w-full">
              <Input
                ref       = {searchInputRef}
                type      = "search"
                className = "pr-9 h-8 text-xs [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
                style     = {{
                  background: PaletteColors().bg,
                  border    : `1px solid ${PaletteColors().border}`,
                  color     : PaletteColors().textActive,
                }}
                value       = {data.search}
                onChange    = {(e) => setData({ ...data, search: e.target.value })}
                placeholder = {
                  listofFilters[attributeName]?.placeholder as string ??
                  "Rechercher..."
                }
              />
              <Icons.Search
                className = "absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                style     = {{ color: PaletteColors().text }}
              />
            </div>
          </form>

          <button
            type         = "button"
            onClick      = {onReset}
            className    = "h-8 px-3 text-xs rounded-md transition-all flex-shrink-0"
            style        = {{ color: "#f87171", border: "1px solid #f87171", background: "transparent" }}
            onMouseEnter = {(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)" }}
            onMouseLeave = {(e) => { e.currentTarget.style.background = "transparent" }}
          >
            Annuler
          </button>
        </div>

        {/* Actions droite */}
        <div className = "flex items-center gap-1 flex-shrink-0">
          {btn(onExportExcel, <><FaRegFileExcel className="text-green-500 text-sm" /> Excel</>)}
          {btn(onExportPdf,   <><FaRegFilePdf   className="text-red-400   text-sm" /> Pdf</>)}

          <div className = "w-px h-5 mx-1" style = {{ background: PaletteColors().border }} />

          {btn(
            onMoreFilters,
            <><Icons.ArrowUpRightIcon className = "h-3 w-3" /> Autres filtres</>,
            { border: `1px solid ${PaletteColors().border}`, paddingLeft: 12, paddingRight: 12 }
          )}
        </div>

      </CardContent>
    </Card>
  )
}