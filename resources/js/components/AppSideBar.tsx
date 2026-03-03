import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { ChevronRight, PanelLeft } from "lucide-react";

export default function AppSidebar()
{
    const { namepage, modules, prefixepermission, page, requestData } = usePage().props;

    const current_page_id = page?.id || null;
    console.log("diop log", page);
    
    const [collapsed, setCollapsed] = useState(false);
    const [openModule, setOpenModule] = useState<number | null>(null);


    useEffect(() =>
    {
        // Cas 1 : racine → module par défaut (seulement si rien n'est déjà ouvert)
        if (!current_page_id)
        {
            if (openModule !== null) return; // déjà ouvert → on ne touche à rien
        
            const defaultMod = modules.find((m: any) => m.open_default === true);
            if (defaultMod)
            {
                setOpenModule(defaultMod.id);
            }
            return;
        }
      
        // Cas 2 : on est sur une page → ouvrir son module parent
        const parent = modules.find((m: any) =>
          m.pages?.some((p: any) => p.id === current_page_id)
        );
      
        if (parent)
        {
          setOpenModule(parent.id);
        }
        // Note : on ne ferme jamais automatiquement ici → l'utilisateur peut refermer s'il veut
      }, [current_page_id, modules]);

    const toggleModule = (id: number) =>
    {
        setOpenModule((prev) => (prev === id ? null : id));
    };

    const isPageActive = (pageId: number | undefined) =>
    {
        return current_page_id === pageId;
    };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="hidden md:flex h-screen border-r bg-background flex-col"
    >
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && <span className="font-semibold text-lg">MyApp</span>}
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {modules.map((module: any) => {
          const isOpen = openModule === module.id;
          const ModuleIcon = module.icon
            ? (Icons[module.icon as keyof typeof Icons] as React.ElementType)
            : null;

          // ── Module avec une seule page ──
          if ((module.pages ?? []).length === 1) {
            const page = module.pages[0];
            const PageIcon = page.icon
              ? (Icons[page.icon as keyof typeof Icons] as React.ElementType)
              : null;
            const active = isPageActive(page.id);

            return (
              <Link
                key={page.id}
                href={`/pages${page.link}`}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/70 text-muted-foreground"
                  }
                `}
              >
                {PageIcon && <PageIcon className="w-5 h-5 flex-shrink-0" />}
                {!collapsed && <span className="truncate">{module.title || page.title}</span>}
              </Link>
            );
          }

          // ── Module avec plusieurs pages ──
          return (
            <div key={module.id}>
              {/* Bouton du module */}
              <button
                onClick={() => toggleModule(module.id)}
                className={`
                  flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm 
                  font-medium transition-colors
                  ${isOpen ? "bg-muted/50" : "hover:bg-muted/70 text-muted-foreground"}
                `}
              >
                <div className="flex items-center gap-3">
                  {ModuleIcon && <ModuleIcon className="w-5 h-5 flex-shrink-0" />}
                  {!collapsed && <span className="truncate">{module.title}</span>}
                </div>

                {!collapsed && (
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}
              </button>

              {/* Sous-pages */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 mt-1 border-l border-border/60 pl-3 space-y-1 py-1">
                      {module.pages.map((page: any) => {
                        const PageIcon = page.icon
                          ? (Icons[page.icon as keyof typeof Icons] as React.ElementType)
                          : null;
                        const active = isPageActive(page.id);

                        return (
                          <Link
                            key={page.id}
                            href={`/pages${page.link}`}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                              ${
                                active
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted/70 text-muted-foreground"
                              }
                            `}
                          >
                            {PageIcon && <PageIcon className="w-4.5 h-4.5 flex-shrink-0" />}
                            {!collapsed && <span className="truncate">{page.title}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* FOOTER - bouton collapse */}
      <div className="h-16 flex items-center justify-end px-4 border-t">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      </div>
    </motion.aside>
  );
}