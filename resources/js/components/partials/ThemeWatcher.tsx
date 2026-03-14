// ThemeWatcher.tsx

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useGlobalStore } from "@/hooks/backoffice"
import { PaletteColors } from "@/lib/utils"


function resolveIsDark(theme: string): boolean
{
  return theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
}
function applyPalette(theme: string)
{
  useGlobalStore.setState((s) => ({
    scope: {
      ...s.scope,
      theme,
      palette: PaletteColors(resolveIsDark(theme)),
    },
  }))
}

export function ThemeWatcher() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    console.log("resolved", resolvedTheme);
    
    if (!resolvedTheme) return
    const dark    = resolvedTheme === "dark"
    const palette = PaletteColors(dark)

    // ← Injecte la palette en CSS variables sur <html>
    const root = document.documentElement
    Object.entries(palette).forEach(([key, value]) =>
    {
      root.style.setProperty(`--palette-${key}`, value as string)
    });

    applyPalette(resolvedTheme);
  }, [resolvedTheme])

  return null
}