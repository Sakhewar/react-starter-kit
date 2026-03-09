import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // On garde motion, mais sans AnimatePresence
import { router, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import * as Icons from "lucide-react";
import { ChevronDown, PanelLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { FaSitemap } from "react-icons/fa";
import { useGlobalStore } from "@/hooks/backoffice";

export default function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const { props } = usePage();
  const { modules = [], active_link } = props as any;

  const [collapsed, setCollapsed] = useState(false);
  const [openModules, setOpenModules] = useState<string[]>([]);

  const { theme } = useTheme();

  // Logique page active
  const isPageActive = (pageLink: string) => {
    if (!active_link || !pageLink) return false;
    return active_link === pageLink;
  };

  // Ouvre automatiquement le module parent de la page active
  useEffect(() => {
    modules.forEach((module: any) => {
      const hasActivePage = module.pages?.some((p: any) => isPageActive(p.link));
      if (hasActivePage && !openModules.includes(module.title)) {
        setOpenModules((prev) => [...prev, module.title]);
      }
    });
  }, [active_link, modules, openModules]);

  useEffect(()=>
  {
    useGlobalStore.setState((state) => ({ ...state, scope: {...state.scope, collapsed: collapsed}}));

  },[collapsed])

  const toggleModule = (title: string) => {
    setOpenModules((prev) => prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 288 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="flex flex-col h-screen border-r bg-background text-foreground overflow-hidden"
    >
      {/* Header établissement */}
      <div
        className={cn(
          "h-16 border-b px-4 flex items-center flex-shrink-0",
          theme === "light" ? "bg-gray-50" : ""
        )}
      >
        
          <div onClick={()=>router.visit('/')} className="flex items-center gap-3 cursor-pointer">
            <FaSitemap className="h-7 w-7" />
            {!collapsed && (<div>
              <div className="font-semibold text-base tracking-tight">OSP</div>
              <div className="text-xs text-gray-500">Hope Future ... OSP</div>
            </div>)}
          </div>
        
        
      </div>

      {/* Menu scrollable */}
      <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-3 py-4 space-y-1">
          {modules.map((module: any, idx: number) => {
            const isOpen = openModules.includes(module.title);
            const ModuleIcon = Icons[module.icon as keyof typeof Icons] || Icons.Folder;
            const hasActiveChild = module.pages?.some((p: any) => isPageActive(p.link));

            return (
              <div key={module.title || idx}>
                {/* Bouton module */}
                <button
                  onClick={() => {
                    if (module.pages?.length === 1) {
                      router.visit(`/pages${module.pages[0].link}`);
                    } else if (module.pages?.length > 1) {
                      if (collapsed) setCollapsed(false);
                      toggleModule(module.title);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors",
                    hasActiveChild || isOpen ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-muted-foreground",
                    module.pages?.length === 1 ? "cursor-pointer" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ModuleIcon className="h-5 w-5 text-muted-foreground" />
                    {!collapsed && <span className="truncate">{module.title}</span>}
                  </div>

                  {!collapsed && module.pages?.length > 1 && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {/* Sous-pages - animation légère sans AnimatePresence */}
                {isOpen && !collapsed && module.pages?.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-visible"
                  >
                    <div className="ml-5 py-1.5 space-y-0.5 border-l border-border pl-3">
                      {module.pages.map((page: any, pIdx: number) => {
                        const PageIcon = Icons[page.icon as keyof typeof Icons] || Icons.FileText;
                        const active = isPageActive(page.link);

                        return (
                          <Link
                            key={pIdx}
                            href={`/pages${page.link}`}
                            onClick={(e) =>
                            {
                              if (active_link === page.link) {
                                e.preventDefault();
                              }
                            }}
                            className={cn(
                              "flex items-center justify-between gap-2 px-3 py-2 rounded-md text-[13px] transition-colors",
                              active
                                ? "bg-accent text-accent-foreground font-medium"
                                : "text-muted-foreground hover:bg-accent/50"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <PageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{page.title}</span>
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
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-accent transition-colors"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
      )}
    </motion.aside>
  );
}