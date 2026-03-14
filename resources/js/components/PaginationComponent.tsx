import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PaletteColors } from "@/lib/utils"

export default function PaginationComponent({
  groupSize = 7,
  totalPages,
  currentPage = 1,
  setCurrentPage,
}: {
  groupSize     : number
  totalPages    : number
  currentPage   : number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}) {
  if (!totalPages || totalPages <= 1) return null

  const currentGroup = Math.floor((currentPage - 1) / groupSize)
  const start        = currentGroup * groupSize + 1
  const end          = Math.min(start + groupSize - 1, totalPages)
  const pages        = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    // ─── Styles ───────────────────────────────────────

  const base: React.CSSProperties = {
      background    : "transparent",
      color         : PaletteColors.text,
      border        : `1px solid ${PaletteColors.border}`,
      borderRadius  : 6,
      fontSize      : 12,
      width         : 30,
      height        : 30,
      display       : "flex",
      alignItems    : "center",
      justifyContent: "center",
      cursor        : "pointer",
      transition    : "all 0.15s",
      userSelect    : "none",
  }

  const active: React.CSSProperties = {
      ...base,
      background: PaletteColors.accent,
      color     : "#fff",
      border    : `1px solid ${PaletteColors.accent}`,
      fontWeight: 600,
  }

  const disabled: React.CSSProperties = {
      ...base,
      opacity      : 0.3,
      cursor       : "not-allowed",
      pointerEvents: "none",
  }

  const hover = (e: React.MouseEvent<HTMLElement>, on: boolean) => {
      e.currentTarget.style.background = on ? PaletteColors.bgHover : "transparent"
      e.currentTarget.style.color      = on ? PaletteColors.textActive : PaletteColors.text
  }

  return (
      <Pagination>
          <PaginationContent className = "gap-1 flex-wrap justify-center">

              {/* Prev */}
              <PaginationItem>
                  <PaginationLink
                      onClick      = {() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      style        = {currentPage <= 1 ? disabled : base}
                      onMouseEnter = {(e) => currentPage > 1 && hover(e, true)}
                      onMouseLeave = {(e) => currentPage > 1 && hover(e, false)}
                  >
                      <ChevronLeft className = "h-3.5 w-3.5" />
                  </PaginationLink>
              </PaginationItem>

              {/* Mobile : X / Y */}
              <PaginationItem className = "flex md:hidden">
                  <span
                      className = "flex items-center px-3 text-xs"
                      style     = {{ color: PaletteColors.text }}
                  >
                      <span style = {{ color: PaletteColors.textActive, fontWeight: 600 }}>
                          {currentPage}
                      </span>
                      <span className = "mx-1">/</span>
                      {totalPages}
                  </span>
              </PaginationItem>

              {/* Desktop : pages complètes */}
              <div className = "hidden md:contents">

                  {start > 1 && (
                      <>
                          <PaginationItem>
                              <PaginationLink
                                  onClick      = {() => setCurrentPage(1)}
                                  style        = {base}
                                  onMouseEnter = {(e) => hover(e, true)}
                                  onMouseLeave = {(e) => hover(e, false)}
                              >
                                  1
                              </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                              <PaginationLink
                                  onClick      = {() => setCurrentPage(start - groupSize)}
                                  style        = {base}
                                  onMouseEnter = {(e) => hover(e, true)}
                                  onMouseLeave = {(e) => hover(e, false)}
                              >
                                  ...
                              </PaginationLink>
                          </PaginationItem>
                      </>
                  )}

                  {pages.map((page) => (
                      <PaginationItem key = {page}>
                          <PaginationLink
                              onClick      = {() => setCurrentPage(page)}
                              style        = {page === currentPage ? active : base}
                              onMouseEnter = {(e) => page !== currentPage && hover(e, true)}
                              onMouseLeave = {(e) => page !== currentPage && hover(e, false)}
                          >
                              {page}
                          </PaginationLink>
                      </PaginationItem>
                  ))}

                  {end < totalPages && (
                      <>
                          <PaginationItem>
                              <PaginationLink
                                  onClick      = {() => setCurrentPage(end + 1)}
                                  style        = {base}
                                  onMouseEnter = {(e) => hover(e, true)}
                                  onMouseLeave = {(e) => hover(e, false)}
                              >
                                  ...
                              </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                              <PaginationLink
                                  onClick      = {() => setCurrentPage(totalPages)}
                                  style        = {base}
                                  onMouseEnter = {(e) => hover(e, true)}
                                  onMouseLeave = {(e) => hover(e, false)}
                              >
                                  {totalPages}
                              </PaginationLink>
                          </PaginationItem>
                      </>
                  )}

              </div>

              {/* Next */}
              <PaginationItem>
                  <PaginationLink
                      onClick      = {() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      style        = {currentPage >= totalPages ? disabled : base}
                      onMouseEnter = {(e) => currentPage < totalPages && hover(e, true)}
                      onMouseLeave = {(e) => currentPage < totalPages && hover(e, false)}
                  >
                      <ChevronRight className = "h-3.5 w-3.5" />
                  </PaginationLink>
              </PaginationItem>

          </PaginationContent>
      </Pagination>
  )
}