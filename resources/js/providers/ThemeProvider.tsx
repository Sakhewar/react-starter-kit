// resources/js/providers/ThemeProvider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"          // Ajoute 'dark' sur <html>
      defaultTheme="system"      // suit les prefs système
      enableSystem               // support system preference
      disableTransitionOnChange  // évite le flash blanc/noir au switch
    >
      {children}
    </NextThemesProvider>
  )
}