import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { router, usePage } from "@inertiajs/react"
import { Link } from "@inertiajs/react"
import * as Icons from "lucide-react"
import { ChevronDown, PanelLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, PaletteProps } from "@/lib/utils"
import { FaSitemap } from "react-icons/fa"
import { useGlobalStore } from "@/hooks/backoffice"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

    // ─── Types ───────────────────────────────────────────

type Page = {
    link : string
    title: string
    icon : string
}

type Module = {
    id        : string | number
    title     : string
    icon      : string
    pages    ?: Page[]
    mode_link?: { nom: string }
}

    // ─── Palette ─────────────────────────────────────────

const S = {
    bg        : "#0f1117",
    bgHover   : "#161b27",
    bgActive  : "#1a2035",
    border    : "#1e2130",
    text      : "#94a3b8",
    textActive: "#e2e8f0",
    accent    : "#3b82f6",
}

    // ─── Hook : collapse ──────────────────────────────────

function useCollapsed() {
    const collapsed    = useGlobalStore((s) => s.scope?.collapsed ?? false)
    const setCollapsed = useCallback((val: boolean) => {
        useGlobalStore.setState((s) => ({
            scope: { ...s.scope, collapsed: val },
        }))
    }, [])
    return [collapsed, setCollapsed] as const
}

    // ─── Hook : flyout ────────────────────────────────────

function useFlyout() {
    const [flyoutModule, setFlyoutModule] = useState<Module | null>(null)
    const [flyoutTop, setFlyoutTop]       = useState(0)
    const flyoutRef                       = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
                setFlyoutModule(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const openFlyout = useCallback(
        (module: Module, e: React.MouseEvent<HTMLButtonElement>) => {
            const rect            = e.currentTarget.getBoundingClientRect()
            const estimatedHeight = (module.pages?.length ?? 0) * 44 + 56
            const clampedTop      = Math.min(
                Math.max(8, rect.top - 8),
                window.innerHeight - estimatedHeight - 8
            )
            setFlyoutTop(clampedTop)
            setFlyoutModule((prev) => (prev?.title === module.title ? null : module))
        },
        []
    )

    const closeFlyout = useCallback(() => setFlyoutModule(null), [])

    return { flyoutModule, flyoutTop, flyoutRef, openFlyout, closeFlyout }
}

    // ─── Hook : open modules ──────────────────────────────

function useOpenModules(modules: Module[], active_link: string) {
    const [openModules, setOpenModules] = useState<string[]>([])

    const isPageActive = useCallback(
        (link: string) => !!active_link && active_link === link,
        [active_link]
    )

    useEffect(() => {
        const toOpen = modules
            .filter((m) => m.pages?.some((p) => isPageActive(p.link)))
            .map((m) => m.title)

        if (toOpen.length === 0) return

        setOpenModules((prev) => {
            const next = toOpen.filter((t) => !prev.includes(t))
            return next.length > 0 ? [...prev, ...next]: prev
        })
    }, [active_link, modules, isPageActive])

    const toggleModule = useCallback((title: string) => {
        setOpenModules((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title): [...prev, title]
        )
    }, [])

    return { openModules, toggleModule, isPageActive }
}

    // ─── Composant principal ──────────────────────────────

export default function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
    const {scope} = useGlobalStore();
    const [palette, setPalette] = useState({} as PaletteProps);
    
    useEffect(()=>
    {
        setPalette(scope?.palette)
        
    },[scope && scope.palette])
    const { props }                     = usePage<{ modules: Module[]; active_link: string }>()
    const { modules = [], active_link } = props

    const [collapsed, setCollapsed]                                       = useCollapsed()
    const { flyoutModule, flyoutTop, flyoutRef, openFlyout, closeFlyout } = useFlyout()
    const { openModules, toggleModule, isPageActive }                     = useOpenModules(modules, active_link)

    const handleModuleClick = useCallback(
        (module: Module, e: React.MouseEvent<HTMLButtonElement>) => {
            if (collapsed) {
                if ((module.pages?.length ?? 0) === 1) {
                    router.visit(`/pages${module.pages![0].link}`)
                } else {
                    openFlyout(module, e)
                }
            } else {
                if ((module.pages?.length ?? 0) === 1) {
                    router.visit(`/pages${module.pages![0].link}`)
                } else {
                    toggleModule(module.title)
                }
            }
        },
        [collapsed, openFlyout, toggleModule]
    )

    const FlyoutModuleIcon = flyoutModule
        ? (Icons[flyoutModule.icon as keyof typeof Icons] as Icons.LucideIcon) || Icons.Folder
        :   null

    return (
        <TooltipProvider delayDuration = {200}>
            <div             className     = "relative flex h-screen">
                    <motion.aside
                        animate    = {{ width: collapsed ? 56 : 260 }}
                        transition = {{ type: "spring", stiffness: 260, damping: 30 }}
                        className  = "flex flex-col h-screen overflow-hidden z-20"
                        style      = {{ background: palette.bg, borderRight: `1px solid ${palette.border}` }}
                    >
                        {/* Header */}
                        <div
                            className = "h-14 flex items-center flex-shrink-0 px-3"
                            style     = {{ borderBottom: `1px solid ${palette.border}` }}
                        >
                            <div
                                onClick   = {() => router.visit("/")}
                                className = "flex items-center gap-3 cursor-pointer"
                            >
                                <div
                                    className = "w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                                    style     = {{ background: palette.bgActive }}
                                >
                                    <FaSitemap className = "h-4 w-4" style = {{ color: palette.accent }} />
                                </div>
                                {!collapsed && (
                                    <div className = "overflow-hidden whitespace-nowrap">
                                    <div className = "font-semibold text-sm" style = {{ color: palette.textActive }}>
                                            POS
                                        </div>
                                        <div className = "text-[10px]" style = {{ color: palette.text }}>
                                            Build By DIOP ❤️
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Menu */}
                        <ScrollArea className = "flex-1 min-h-0">
                        <div        className = "py-3 space-y-4 px-2">
                                {modules.map((module, idx) => {
                                    const isOpen         = openModules.includes(module.title)
                                    const hasActiveChild = module.pages?.some((p) => isPageActive(p.link)) ?? false
                                    const isFlyoutOpen   = flyoutModule?.title === module.title
                                    const isHighlighted  = hasActiveChild || isOpen || isFlyoutOpen
                                    const ModuleIcon     = 
                                        (Icons[module.icon as keyof typeof Icons] as Icons.LucideIcon) ||
                                        Icons.Folder

                                    return (
                                        <div key = {module.id ?? idx} className = "relative">

                                            {/* Indicateur actif */}
                                            {hasActiveChild && (
                                                <span
                                                    className = "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                                                    style     = {{ background: palette.accent, color: palette.accentFg }}
                                                />
                                            )}

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick   = {(e) => handleModuleClick(module, e)}
                                                        className = "flex w-full items-center justify-between px-2 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                                                        style     = {{
                                                            background: isHighlighted ? palette.bgActive  : "transparent",
                                                            color     : isHighlighted ? palette.textActive: palette.text,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isHighlighted)
                                                                e.currentTarget.style.background = palette.bgHover
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!isHighlighted)
                                                                e.currentTarget.style.background = "transparent"
                                                        }}
                                                    >
                                                        <div className = "flex items-center gap-3">
                                                            <ModuleIcon
                                                                className = "h-4 w-4 flex-shrink-0"
                                                                style     = {{ color: isHighlighted ? palette.accent : palette.text }}
                                                            />
                                                            {!collapsed && (
                                                                <span className = "truncate">{module.title}</span>
                                                            )}
                                                        </div>

                                                        {!collapsed && (module.pages?.length ?? 0) > 1 && (
                                                            <ChevronDown
                                                                className={cn(
                                                                    "h-3 w-3 flex-shrink-0 transition-transform duration-200",
                                                                    isOpen && "rotate-180"
                                                                )}
                                                                style = {{ color: palette.text }}
                                                            />
                                                        )}
                                                    </button>
                                                </TooltipTrigger>

                                                {/* Tooltip uniquement en mode collapsed */}
                                                {collapsed && (
                                                    <TooltipContent
                                                        side  = "right"
                                                        style = {{
                                                            background: "#1e2130",
                                                            border    : `1px solid ${palette.border}`,
                                                            color     : palette.bg,
                                                            fontSize  : "12px",
                                                        }}
                                                    >
                                                        {module.title}
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>

                                            {/* Sous-pages accordion */}
                                            {!collapsed && (module.pages?.length ?? 0) > 1 && (
                                                <motion.div
                                                    initial = {false}
                                                    animate = {{
                                                        opacity: isOpen ? 1     : 0,
                                                        height : isOpen ? "auto": 0,
                                                    }}
                                                    transition = {{ duration: 0.2, ease: "easeOut" }}
                                                    style      = {{ overflow: "hidden" }}
                                                >
                                                    <div
                                                        className = "ml-4 mt-0.5 mb-0.5 pl-3 space-y-0.5"
                                                        style     = {{ borderLeft: `1px solid ${palette.border}` }}
                                                    >
                                                        {module.pages!.map((page) => {
                                                            const PageIcon = 
                                                                (Icons[page.icon as keyof typeof Icons] as Icons.LucideIcon) ||
                                                                Icons.FileText
                                                            const active = isPageActive(page.link)
                                                            return (
                                                                <Link
                                                                    key       = {page.link}
                                                                    href      = {`/pages${page.link}`}
                                                                    onClick   = {(e) => { if (active) e.preventDefault() }}
                                                                    className = "flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] transition-all"
                                                                    style     = {{
                                                                        background: active ? palette.bgActive  : "transparent",
                                                                        color     : active ? palette.textActive: palette.text,
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        if (!active)
                                                                            (e.currentTarget as HTMLElement).style.background = palette.bgHover
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        if (!active)
                                                                            (e.currentTarget as HTMLElement).style.background = "transparent"
                                                                    }}
                                                                >
                                                                    <PageIcon
                                                                        className = "h-3.5 w-3.5 flex-shrink-0"
                                                                        style     = {{ color: active ? palette.accent : palette.text }}
                                                                    />
                                                                    <span className = "truncate">{page.title}</span>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>

                        {/* Footer toggle */}
                        {!isMobile && (
                            <div
                                className = "h-12 flex items-center justify-end px-3 flex-shrink-0"
                                style     = {{ borderTop: `1px solid ${palette.border}` }}
                            >
                                <button
                                    onClick      = {() => { setCollapsed(!collapsed); closeFlyout() }}
                                    className    = "w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                                    style        = {{ color: palette.text }}
                                    onMouseEnter = {(e) => {
                                        e.currentTarget.style.background = palette.bgHover
                                        e.currentTarget.style.color      = palette.textActive
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent"
                                        e.currentTarget.style.color      = palette.text
                                    }}
                                >
                                    <PanelLeft className = "h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </motion.aside>

                    {/* Flyout (mode collapsed) */}
                    <AnimatePresence>
                        {collapsed && flyoutModule && (
                            <motion.div
                                ref        = {flyoutRef}
                                key        = "flyout"
                                initial    = {{ opacity: 0, x: -10 }}
                                animate    = {{ opacity: 1, x: 0 }}
                                exit       = {{ opacity: 0, x: -10 }}
                                transition = {{ duration: 0.15, ease: "easeOut" }}
                                style      = {{
                                    top         : flyoutTop,
                                    left        : 60,
                                    position    : "fixed",
                                    zIndex      : 50,
                                    background  : palette.bg,
                                    border      : `1px solid ${palette.border}`,
                                    borderRadius: 8,
                                    overflow    : "hidden",
                                    boxShadow   : "0 8px 32px rgba(0,0,0,0.4)",
                                }}
                            >
                                {/* Header flyout */}
                                <div
                                    className = "px-4 py-2.5 flex gap-2 items-center"
                                    style     = {{ borderBottom: `1px solid ${palette.border}`, background: palette.bgActive }}
                                >
                                    {FlyoutModuleIcon && (
                                        <FlyoutModuleIcon className = "h-4 w-4" style = {{ color: palette.accent }} />
                                    )}
                                    <p
                                        className = "text-[11px] uppercase tracking-widest font-semibold"
                                        style     = {{ color: palette.textActive }}
                                    >
                                        {flyoutModule.title}
                                    </p>
                                </div>

                                {flyoutModule.mode_link?.nom === "card-view" ? (
                                    <div className = "p-3 grid grid-cols-2 gap-2 max-w-[300px]">
                                        {flyoutModule.pages?.map((page) => {
                                            const PageIcon = 
                                                (Icons[page.icon as keyof typeof Icons] as Icons.LucideIcon) ||
                                                Icons.FileText
                                            const active = isPageActive(page.link)
                                            return (
                                                <Link
                                                    key       = {page.link}
                                                    href      = {`/pages${page.link}`}
                                                    onClick   = {(e) => { if (active) e.preventDefault(); closeFlyout() }}
                                                    className = "flex flex-col items-center gap-2 p-3 rounded-lg text-center transition-all"
                                                    style     = {{
                                                        background: active ? palette.bgActive                                           : palette.bgHover,
                                                        border    : `1px solid ${active ? palette.accent + "40" : palette.border}`,
                                                        color     : active ? palette.textActive                                         : palette.text,
                                                    }}
                                                >
                                                    <div className = "p-2 rounded-lg" style = {{ background: palette.bg }}>
                                                        <PageIcon
                                                            className = "h-4 w-4"
                                                            style     = {{ color: active ? palette.accent : palette.text }}
                                                        />
                                                    </div>
                                                    <span className = "text-[11px] font-medium leading-tight">
                                                        {page.title}
                                                    </span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className = "py-1.5 min-w-[200px]">
                                        {flyoutModule.pages?.map((page) => {
                                            const PageIcon = 
                                                (Icons[page.icon as keyof typeof Icons] as Icons.LucideIcon) ||
                                                Icons.FileText
                                            const active = isPageActive(page.link)
                                            return (
                                                <Link
                                                    key       = {page.link}
                                                    href      = {`/pages${page.link}`}
                                                    onClick   = {(e) => { if (active) e.preventDefault(); closeFlyout() }}
                                                    className = "flex items-center gap-3 px-4 py-2 text-[13px] transition-all"
                                                    style     = {{
                                                        background: active ? palette.bgActive  : "transparent",
                                                        color     : active ? palette.textActive: palette.text,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!active)
                                                            (e.currentTarget as HTMLElement).style.background = palette.bgHover
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!active)
                                                            (e.currentTarget as HTMLElement).style.background = "transparent"
                                                    }}
                                                >
                                                    <div
                                                        className = "p-1.5 rounded-md"
                                                        style     = {{ background: active ? palette.bgHover : palette.bgActive }}
                                                    >
                                                        <PageIcon
                                                            className = "h-3.5 w-3.5"
                                                            style     = {{ color: active ? palette.accent : palette.text }}
                                                        />
                                                    </div>
                                                    <span>{page.title}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
            </div>
        </TooltipProvider>
    )
}