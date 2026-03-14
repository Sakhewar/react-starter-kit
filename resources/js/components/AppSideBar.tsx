import { useState, useEffect, useRef, useCallback } from "react";
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

// ----------- Types -----------

type Page = {
  link: string;
  title: string;
  icon: string;
};

type Module = {
  id: string | number;
  title: string;
  icon: string;
  pages?: Page[];
  mode_link?: { nom: string };
};

// ----------- Hook : collapse state -----------

function useCollapsed() {
  const collapsed = useGlobalStore((s) => s.scope?.collapsed ?? false);
  const setCollapsed = useCallback((val: boolean) => {
    useGlobalStore.setState((s) => ({
      scope: { ...s.scope, collapsed: val },
    }));
  }, []);
  return [collapsed, setCollapsed] as const;
}

// ----------- Hook : flyout -----------

function useFlyout() {
  const [flyoutModule, setFlyoutModule] = useState<Module | null>(null);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setFlyoutModule(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFlyout = useCallback(
    (module: Module, e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const estimatedHeight = (module.pages?.length ?? 0) * 44 + 56;
      const clampedTop = Math.min(
        Math.max(8, rect.top - 8),
        window.innerHeight - estimatedHeight - 8
      );
      setFlyoutTop(clampedTop);
      setFlyoutModule((prev) => (prev?.title === module.title ? null : module));
    },
    []
  );

  const closeFlyout = useCallback(() => setFlyoutModule(null), []);

  return { flyoutModule, flyoutTop, flyoutRef, openFlyout, closeFlyout };
}

// ----------- Hook : open modules -----------

function useOpenModules(modules: Module[], active_link: string) {
  const [openModules, setOpenModules] = useState<string[]>([]);

  const isPageActive = useCallback(
    (link: string) => !!active_link && active_link === link,
    [active_link]
  );

  useEffect(() => {
    const toOpen = modules
      .filter((m) => m.pages?.some((p) => isPageActive(p.link)))
      .map((m) => m.title);

    if (toOpen.length === 0) return;

    setOpenModules((prev) => {
      const next = toOpen.filter((t) => !prev.includes(t));
      return next.length > 0 ? [...prev, ...next] : prev;
    });
  }, [active_link, modules, isPageActive]);

  const toggleModule = useCallback((title: string) => {
    setOpenModules((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  }, []);

  return { openModules, toggleModule, isPageActive };
}

// ----------- Sub-components -----------

function ModuleButton({
  module,
  collapsed,
  isOpen,
  hasActiveChild,
  isFlyoutOpen,
  onClick,
}: {
  module: Module;
  collapsed: boolean;
  isOpen: boolean;
  hasActiveChild: boolean;
  isFlyoutOpen: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const ModuleIcon =
    (Icons[module.icon as keyof typeof Icons] as Icons.LucideIcon) ||
    Icons.Folder;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors",
        hasActiveChild || isOpen || isFlyoutOpen
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 text-muted-foreground"
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3">
            <ModuleIcon className="h-4 w-4 text-black dark:text-white" />
            {!collapsed && (
              <span className="truncate text-black dark:text-white">
                {module.title}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{module.title}</p>
        </TooltipContent>
      </Tooltip>

      {!collapsed && (module.pages?.length ?? 0) > 1 && (
        <ChevronDown
          className={cn(
            "h-4 w-4 text-black dark:text-white transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      )}
    </button>
  );
}

function PageLink({
  page,
  active,
}: {
  page: Page;
  active: boolean;
}) {
  const PageIcon =
    (Icons[page.icon as keyof typeof Icons] as Icons.LucideIcon) ||
    Icons.FileText;

  return (
    <Link
      href={`/pages${page.link}`}
      onClick={(e) => {
        if (active) e.preventDefault();
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
}

function FlyoutPageLink({
  page,
  active,
  isCardView,
  onClose,
}: {
  page: Page;
  active: boolean;
  isCardView: boolean;
  onClose: () => void;
}) {
  const PageIcon =
    (Icons[page.icon as keyof typeof Icons] as Icons.LucideIcon) ||
    Icons.FileText;

  if (isCardView) {
    return (
      <Link
        href={`/pages${page.link}`}
        onClick={(e) => {
          if (active) e.preventDefault();
          onClose();
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-all border",
          active
            ? "bg-accent text-accent-foreground border-accent font-medium"
            : "bg-muted/40 hover:bg-accent/60 text-muted-foreground border-transparent hover:border-accent/30"
        )}
      >
        <div className="p-2 rounded-full bg-background shadow-sm">
          <PageIcon className="h-5 w-5 text-black dark:text-white" />
        </div>
        <span className="text-[12px] leading-tight text-black dark:text-white font-medium">
          {page.title}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/pages${page.link}`}
      onClick={(e) => {
        if (active) e.preventDefault();
        onClose();
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
        <PageIcon className="h-4 w-4 text-black dark:text-white" />
      </div>
      <span className="truncate text-black dark:text-white">{page.title}</span>
    </Link>
  );
}

// ----------- Composant principal -----------

export default function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const { props } = usePage<{ modules: Module[]; active_link: string }>();
  const { modules = [], active_link } = props;

  const [collapsed, setCollapsed] = useCollapsed();
  const { flyoutModule, flyoutTop, flyoutRef, openFlyout, closeFlyout } = useFlyout();
  const { openModules, toggleModule, isPageActive } = useOpenModules(modules, active_link);

  const { theme } = useTheme();

  const handleModuleClick = useCallback(
    (module: Module, e: React.MouseEvent<HTMLButtonElement>) => {
      if (collapsed) {
        if ((module.pages?.length ?? 0) === 1) {
          router.visit(`/pages${module.pages![0].link}`);
        } else {
          openFlyout(module, e);
        }
      } else {
        if ((module.pages?.length ?? 0) === 1) {
          router.visit(`/pages${module.pages![0].link}`);
        } else {
          toggleModule(module.title);
        }
      }
    },
    [collapsed, openFlyout, toggleModule]
  );

  const FlyoutModuleIcon = flyoutModule
    ? (Icons[flyoutModule.icon as keyof typeof Icons] as Icons.LucideIcon) ||
      Icons.Folder
    : null;

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
          <div
            onClick={() => router.visit("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <FaSitemap className="h-7 w-7" />
            {!collapsed && (
              <div>
                <div className="font-semibold text-base tracking-tight">POS</div>
                <div className="text-xs text-gray-500">Build By DIOP With ❤️</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-3 py-4 space-y-1">
            {modules.map((module, idx) => {
              const isOpen = openModules.includes(module.title);
              const hasActiveChild = module.pages?.some((p) => isPageActive(p.link)) ?? false;
              const isFlyoutOpen = flyoutModule?.title === module.title;

              return (
                <div key={module.id ?? idx}>
                  <ModuleButton
                    module={module}
                    collapsed={collapsed}
                    isOpen={isOpen}
                    hasActiveChild={hasActiveChild}
                    isFlyoutOpen={isFlyoutOpen}
                    onClick={(e) => handleModuleClick(module, e)}
                  />

                  {/* Sous-pages — initial=false pour éviter l'animation au chargement/navigation */}
                  {!collapsed && (module.pages?.length ?? 0) > 1 && (
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        height: isOpen ? "auto" : 0,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="ml-5 py-1.5 space-y-0.5 border-l border-black dark:border-white pl-3">
                        {module.pages!.map((page) => (
                          <PageLink
                            key={page.link}
                            page={page}
                            active={isPageActive(page.link)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
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
                closeFlyout();
              }}
              className="p-2 rounded hover:bg-accent transition-colors"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          </div>
        )}
      </motion.aside>

      {/* Flyout */}
      <AnimatePresence>
        {collapsed && flyoutModule && (
          <motion.div
            ref={flyoutRef}
            key="flyout"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ top: flyoutTop }}
            className="fixed left-[72px] z-50 bg-background border border-border rounded-[5px] shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b bg-accent/30 flex gap-2">
              {FlyoutModuleIcon && <FlyoutModuleIcon className="h-4 w-4" />}
              <p className="text-[11px] uppercase tracking-widest font-semibold">
                {flyoutModule.title}
              </p>
            </div>

            {flyoutModule.mode_link?.nom === "card-view" ? (
              <div className="p-3 grid grid-cols-2 gap-2 max-w-[320px]">
                {flyoutModule.pages?.map((page) => (
                  <FlyoutPageLink
                    key={page.link}
                    page={page}
                    active={isPageActive(page.link)}
                    isCardView={true}
                    onClose={closeFlyout}
                  />
                ))}
              </div>
            ) : (
              <div className="py-1.5 min-w-[220px] max-w-[280px]">
                {flyoutModule.pages?.map((page) => (
                  <FlyoutPageLink
                    key={page.link}
                    page={page}
                    active={isPageActive(page.link)}
                    isCardView={false}
                    onClose={closeFlyout}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}