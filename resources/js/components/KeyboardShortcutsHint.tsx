import { useState } from "react"
import { Keyboard } from "lucide-react"
import { useGlobalStore } from "@/hooks/backoffice"

type Shortcut = {
  key        : string
  description: string
}

const shortcuts: Shortcut[] = [
  { key: "N",      description: "Créer un nouvel élément" },
  { key: "F",      description: "Focus sur la recherche"  },
  { key: "Escape", description: "Fermer / Désélectionner" },
]

export function KeyboardShortcutsHint() {
  const palette          = useGlobalStore((s) => s.scope?.palette)
  const [open, setOpen]  = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => { setOpen(true);  setHovered(true)  }}
        onMouseLeave={() => { setOpen(false); setHovered(false) }}
        className="flex items-center justify-center w-7 h-7 rounded-md transition-all"
        style={{
          color     : hovered ? palette?.textActive : palette?.text,
          border    : `1px solid ${palette?.border}`,
          background: hovered ? palette?.bgHover    : "transparent",
        }}
      >
        <Keyboard className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 right-0 z-50 rounded-lg overflow-hidden"
          style={{
            background: palette?.bgActive,
            border    : `1px solid ${palette?.border}`,
            boxShadow : "0 8px 24px rgba(0,0,0,0.3)",
            minWidth  : 220,
          }}
        >
          <div
            className="px-3 py-2 flex items-center gap-2"
            style={{ borderBottom: `1px solid ${palette?.border}` }}
          >
            <Keyboard className="h-3.5 w-3.5" style={{ color: palette?.accent }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: palette?.textActive }}
            >
              Raccourcis
            </span>
          </div>

          <div className="py-1.5">
            {shortcuts.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between px-3 py-1.5 gap-6"
              >
                <span className="text-xs" style={{ color: palette?.text }}>
                  {s.description}
                </span>
                <kbd
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono flex-shrink-0"
                  style={{
                    background: palette?.bg,
                    border    : `1px solid ${palette?.border}`,
                    color     : palette?.textActive,
                  }}
                >
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}