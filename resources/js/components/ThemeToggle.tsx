'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGlobalStore } from '@/hooks/backoffice'
import { PaletteColors } from '@/lib/utils'
import { useEffect, useCallback } from 'react'

// ─── Helper ───────────────────────────────────────────

function resolveIsDark(theme: string): boolean {
  return theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
}

function applyPalette(theme: string) {
  useGlobalStore.setState((s) => ({
    scope: {
      ...s.scope,
      theme,
      palette: PaletteColors(resolveIsDark(theme)),
    },
  }))
}

// ─── Composant ────────────────────────────────────────

export function ThemeToggle() {
  const { setTheme } = useTheme()

  const handleSetTheme = useCallback((theme: string) => {
    setTheme(theme)
    applyPalette(theme)
  }, [setTheme])

  // ─── Écoute changement thème OS ───────────────────
  useEffect(() => {
    const media    = window.matchMedia("(prefers-color-scheme: dark)")

    const onChange = (e: MediaQueryListEvent) =>
    {
      const currentTheme = useGlobalStore.getState().scope?.theme ?? "system"
      if (currentTheme === "system")
      { 
        useGlobalStore.setState((s) => ({
          scope: {
            ...s.scope,
            palette: PaletteColors(e.matches),
          },
        }))
      }
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Sun  className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[
          { label: "Light",  value: "light"  },
          { label: "Dark",   value: "dark"   },
          { label: "System", value: "system" },
        ].map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => handleSetTheme(item.value)}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}