import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import * as Icons from "lucide-react";
import { ChevronDown, PanelLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { FaSitemap } from "react-icons/fa";

export default function AppSidebar({isMobile = false} : {isMobile?: boolean})
{
  const { props } = usePage();
  const { modules = [], active_link } = props as any;

  const [collapsed, setCollapsed] = useState(false);
  const [openModules, setOpenModules] = useState<string[]>([]);

  const { theme } = useTheme()

  // Logique page active
  const isPageActive = (pageLink: string) =>
  { 
    if (!active_link || !pageLink) return false;

    return active_link === pageLink;
  };

  // Ouvre automatiquement le module parent de la page active
  useEffect(() =>
  {
    modules.forEach((module: any) => {
      const hasActivePage = module.pages?.some((p: any) => isPageActive(p.link));
      if (hasActivePage && !openModules.includes(module.title))
      {
        setOpenModules((prev) => [...prev, module.title]);
      }
    });
  }, [active_link, modules, openModules]);

  const toggleModule = (title: string) =>
  {
    setOpenModules((prev) => prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 288 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="flex flex-col h-full border-r bg-background text-foreground"
    >
      {/* Header établissement */}
      <div className={cn("h-16 border-b px-4 flex items-center flex-shrink-0",
        theme === "light" ? "bg-gray-50" : ""
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <FaSitemap className="h-7 w-7" />
            <div>
              <div className="font-semibold text-base tracking-tight">OSP</div>
              <div className="text-xs text-gray-500">Hope Future ... OSP</div>
            </div>
          </div>
        )}
      </div>

      {/* Menu scrollable */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4 space-y-1">
          {modules.map((module: any, idx: number) => {
            const isOpen = openModules.includes(module.title);
            const ModuleIcon = Icons[module.icon as keyof typeof Icons] || Icons.Folder;
            const hasActiveChild = module.pages?.some((p: any) => isPageActive(p.link));


            return (
              <div key={module.title || idx}>
                {/* Bouton module */}
                <button 
                  onClick={
                    function()
                    {
                      if(module.pages?.length === 1)
                      {
                        router.visit(`/pages${module.pages[0].link}`);
                      }
                      else if(module.pages?.length > 1)
                      {
                        if(collapsed) setCollapsed(!collapsed)
                        toggleModule(module.title)
                      }
                    }
                  }
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    hasActiveChild || isOpen ? "bg-black-50 text-black-700" : "hover:bg-gray-100 text-gray-700",
                    module.pages?.length == 1 ? "cursor-pointer" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ModuleIcon className="h-5 w-5 text-gray-600" />
                    {!collapsed && <span className="truncate">{module.title}</span>}
                  </div>

                  {!collapsed && module.pages?.length > 1 && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-500 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {/* Sous-pages */}
                <AnimatePresence>
                  {isOpen && !collapsed && module.pages?.length > 1 && (
                    <div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5 py-1.5 space-y-0.5 border-l border-gray-200 pl-3">
                        {module.pages.map((page: any, pIdx: number) =>
                        {
                          const PageIcon = Icons[page.icon as keyof typeof Icons] || Icons.FileText;
                          const active = isPageActive(page.link);

                          return (
                            <Link key={pIdx} href={`/pages${page.link}`}
                              className={cn(
                                "flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                active
                                  ? "bg-black-50 text-black-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <PageIcon className="h-4 w-4 text-gray-500" />
                                <span className="truncate">{page.title}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer collapse */}
      {!isMobile &&<div className={cn("h-16 border-t px-4 flex items-center justify-end flex-shrink-0",
        theme === "light" ? "bg-gray-50" : ""
      )}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>}
    </motion.aside>
  );
}