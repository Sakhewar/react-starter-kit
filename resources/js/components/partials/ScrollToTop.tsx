import { useEffect, useState } from "react"
import { ArrowUpIcon, ChevronUp } from "lucide-react"
import { useGlobalStore } from "@/hooks/backoffice"
import { PaletteProps } from "@/lib/utils"

export function ScrollToTop({palette}: {palette: PaletteProps})
{
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const container = document.querySelector("main") ?? window
  
    const handleScroll = () => {
      const scrollY = container instanceof Window
        ? container.scrollY
        :  (container as Element).scrollTop
      setVisible(scrollY > 300)
    }
  
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])
  
  const scrollToTop = () => {
    const container = document.querySelector("main") ?? window
    container instanceof Window
      ? container.scrollTo({ top: 0, behavior: "smooth" })
      :  (container as Element).scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible) return null

  return (
    <button
      onClick      = {scrollToTop}
      onMouseEnter = {() => setHovered(true)}
      onMouseLeave = {() => setHovered(false)}
      className    = "fixed bottom-20 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-[6px] transition-all duration-200"
      style        = {{
        //background: hovered ? palette?.accent                                 : palette?.bgActive,
        background: palette?.accent,
        border    : `1px solid ${hovered ? palette?.accent : palette?.border}`,
        color     : hovered ? palette?.accentFg                               : palette?.text,
        boxShadow : `0 4px 12px ${palette?.shadow}`,
        transform : hovered ? "translateY(-2px)"                              : "translateY(0)",
      }}
      title = "Remonter en haut"
    >
      <ArrowUpIcon className = "h-4 w-4" style={{color : palette?.accentFg}} />
    </button>
  )
}