import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import * as Icons from "lucide-react";
import { ChevronDown, PanelLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { FaSitemap } from "react-icons/fa";
import { useGlobalStore } from "@/hooks/backoffice";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const { props } = usePage();
  const { modules = [], active_link } = props as any;

  const [openModules, setOpenModules] = useState<string[]>([]);

  const [flyoutModule, setFlyoutModule] = useState<any | null>(null);
  const [FlyoutModuleIcon, setFlyoutModuleIcon] = useState<any | null>(null);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const collapsed = useGlobalStore((state) => state.scope?.collapsed ?? false);
  const setCollapsed = (val: boolean) =>
    useGlobalStore.setState((state) => ({
      scope: { ...state.scope, collapsed: val },
    }));

  const { theme } = useTheme();

  const isPageActive = (pageLink: string) => {
    if (!active_link || !pageLink) return false;
    return active_link === pageLink;
  };

  useEffect(() => {
    modules.forEach((module: any) => {
      const hasActivePage = module.pages?.some((p: any) => isPageActive(p.link));
      if (hasActivePage && !openModules.includes(module.title)) {
        setOpenModules((prev) => [...prev, module.title]);
      }
    });
  }, [active_link, modules]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setFlyoutModule(null);
        setFlyoutModuleIcon(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleModule = (title: string) => {
    setOpenModules((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleCollapsedModuleClick = (module: any, e: React.MouseEvent<HTMLButtonElement>) => {
    if (module.pages?.length === 1) {
      router.visit(`/pages${module.pages[0].link}`);
      return;
    }
    if (module.pages?.length > 1) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setFlyoutTop(rect.top);
      setFlyoutModule((prev: any) => (prev?.title === module.title ? null : module));
      const ModuleIcon = Icons[module.icon as keyof typeof Icons] || Icons.Folder;
      setFlyoutModuleIcon(ModuleIcon);
    }
  };

  return (
    <div className="relative flex h-screen">
      <motion.aside
        animate={{ width: collapsed ? 72 : 288 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="flex flex-col h-screen border-r bg-background text-foreground overflow-hidden z-20"
      >
        {/* Header */}
        <div
          className={cn(
            "h-16 border-b px-4 flex items-center flex-shrink-0",
            theme === "light" ? "bg-gray-50" : ""
          )}
        >
          <div onClick={() => router.visit("/")} className="flex items-center gap-3 cursor-pointer">
            <FaSitemap className="h-7 w-7" />
            {!collapsed && (
              <div>
                <div className="font-semibold text-base tracking-tight">POS</div>
                <div className="text-xs text-gray-500">Build By DIOP With ❤️</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu scrollable */}
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-3 py-4 space-y-1">
            {modules.map((module: any, idx: number) => {
              const isOpen = openModules.includes(module.title);
              const ModuleIcon = Icons[module.icon as keyof typeof Icons] || Icons.Folder;
              const hasActiveChild = module.pages?.some((p: any) => isPageActive(p.link));
              const isFlyoutOpen = flyoutModule?.title === module.title;

              return (
                <div key={module.title || idx}>
                  <button
                    onClick={(e) => {
                      if (collapsed) {
                        handleCollapsedModuleClick(module, e);
                      } else {
                        if (module.pages?.length === 1) {
                          router.visit(`/pages${module.pages[0].link}`);
                        } else if (module.pages?.length > 1) {
                          toggleModule(module.title);
                        }
                      }
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors",
                      hasActiveChild || isOpen || isFlyoutOpen
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50 text-muted-foreground"
                    )}
                  >
                    <Tooltip key={module.id}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3">
                          <ModuleIcon className="h-4 w-4 text-black dark:text-white" />
                          {!collapsed && <span className="truncate text-black dark:text-white">{module.title}</span>}
                        </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{module.title}</p>
                        </TooltipContent>
                    </Tooltip>

                    {!collapsed && module.pages?.length > 1 && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-black dark:text-white transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {/* Sous-pages expanded (mode non-collapsed) */}
                  {isOpen && !collapsed && module.pages?.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-visible"
                    >
                      <div className="ml-5 py-1.5 space-y-0.5 border-l border-black dark:border-white pl-3">
                        {module.pages.map((page: any, pIdx: number) => {
                          const PageIcon =
                            Icons[page.icon as keyof typeof Icons] || Icons.FileText;
                          const active = isPageActive(page.link);
                          return (
                            <Link
                              key={pIdx}
                              href={`/pages${page.link}`}
                              onClick={(e) => {
                                if (active_link === page.link) e.preventDefault();
                              }}
                              className={cn(
                                "flex items-center justify-between gap-2 px-3 py-2 rounded-md text-[13px] transition-colors",
                                active
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground hover:bg-accent/50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <PageIcon className="h-4 w-4 text-black dark:text-white" />
                                <span className="truncate text-black dark:text-white">{page.title}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer collapse */}
        {!isMobile && (
          <div
            className={cn(
              "h-16 border-t px-4 flex items-center justify-end flex-shrink-0",
              theme === "light" ? "bg-gray-50" : ""
            )}
          >
            <button
              onClick={() => {
                setCollapsed(!collapsed);
                setFlyoutModule(null);
              }}
              className="p-2 rounded hover:bg-accent transition-colors"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          </div>
        )}
      </motion.aside>

      {/* ── Flyout Panel (collapsed mode) ── */}
      <AnimatePresence>
        {collapsed && flyoutModule && (
          <motion.div
            ref={flyoutRef}
            key="flyout"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ top: Math.max(8, flyoutTop - 8) }}
            className="fixed left-[72px] z-50 bg-background border border-border rounded-[5px] shadow-2xl overflow-hidden"
          >
            {/* Titre du module */}
            <div className="px-4 py-3 border-b bg-accent/30 flex gap-2">
              {FlyoutModuleIcon && <FlyoutModuleIcon className="h-4 w-4" />}
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                {flyoutModule.title}
              </p>
            </div>

            {flyoutModule.mode_link?.nom === "card-view" ? (
              /* ── CARD VIEW ── */
              <div className="p-3 grid grid-cols-2 gap-2 max-w-[320px]">
                {flyoutModule.pages?.map((page: any, pIdx: number) => {
                  const PageIcon =
                    Icons[page.icon as keyof typeof Icons] || Icons.FileText;
                  const active = isPageActive(page.link);
                  return (
                    <Link
                      key={pIdx}
                      href={`/pages${page.link}`}
                      onClick={(e) => {
                        if (isPageActive(page.link)) e.preventDefault();
                        setFlyoutModule(null);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-all border",
                        active
                          ? "bg-accent text-accent-foreground border-accent font-medium"
                          : "bg-muted/40 hover:bg-accent/60 text-muted-foreground border-transparent hover:border-accent/30"
                      )}
                    >
                      <div className="p-2 rounded-full bg-background shadow-sm">
                        <PageIcon className="h-5 w-5" />
                      </div>
                      <span className="text-[12px] leading-tight font-medium">{page.title}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* ── LISTE VIEW ── */
              <div className="py-1.5 min-w-[220px] max-w-[280px]">
                {flyoutModule.pages?.map((page: any, pIdx: number) => {
                  const PageIcon =
                    Icons[page.icon as keyof typeof Icons] || Icons.FileText;
                  const active = isPageActive(page.link);
                  return (
                    <Link
                      key={pIdx}
                      href={`/pages${page.link}`}
                      onClick={(e) => {
                        if (isPageActive(page.link)) e.preventDefault();
                        setFlyoutModule(null);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors",
                        active
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-muted-foreground hover:bg-accent/50"
                      )}
                    >
                      <div
                        className={cn(
                          "p-1.5 rounded-md",
                          active ? "bg-background shadow-sm" : "bg-muted/50"
                        )}
                      >
                        <PageIcon className="h-4 w-4" />
                      </div>
                      <span className="truncate">{page.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}