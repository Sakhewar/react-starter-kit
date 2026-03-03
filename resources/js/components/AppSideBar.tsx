import { Link, usePage } from "@inertiajs/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import * as Icons from "lucide-react"
import { ChevronRight, PanelLeft } from "lucide-react"

export default function AppSidebar()
{
    const { modules } = usePage().props as any;
    const defaultModule = modules.find((m: any) => m.open_default);
    const [collapsed, setCollapsed] = useState(false);
    const [openModule, setOpenModule] = useState<number | null>(defaultModule ? defaultModule.id : null);

    const toggleModule = (id: number) =>
    {
        setOpenModule((prev) => (prev === id ? null : id))
    }
    
    return(
        <motion.aside
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="hidden md:flex h-screen border-r bg-background flex-col">

            {/* HEADER */}
             <div className="h-16 flex items-center justify-between px-4 border-b">
                {!collapsed && (<span className="font-semibold text-lg">MyApp</span>)}
            </div>

           

            {/* CONTENT */}
            <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
                {modules.map((module: any) =>
                {   
                    const isOpen = openModule === module.id;
                    const ModuleIcon = module.icon ? (Icons[module.icon as keyof typeof Icons] as React.ElementType) : null;

                    if((module.pages ?? []).length ===1)
                    {
                        const page = (module.pages ?? [])[0];
                        const PageIcon = page.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;
                        return (
                            <div key={module.id}>
                                <Link key={page.id} href={`/pages${page.link}`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted/60 transition">
                                    {PageIcon && <PageIcon className="w-4 h-4" />}
                                    {!collapsed && <span>{module.title}</span>}
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <div key={module.id}>

                            {/* MODULES */}

                            {/* Si le module a plus d'une page */}

                            {(module.pages ?? []).length > 1  &&
                                <button onClick={() => toggleModule(module.id)}
                                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted/60 transition">
                                    <div className="flex items-center gap-3">
                                    {ModuleIcon && <ModuleIcon className="w-4 h-4" />}
                                    {!collapsed && <span>{module.title}</span>}
                                    </div>

                                    {!collapsed && (
                                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }}transition={{ duration: 0.2 }}>
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.div>
                                    )}
                                </button>
                            }

                            {/* SUBMODULES */}
                            <AnimatePresence>
                                {isOpen && !collapsed && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }} className="ml-4 mt-1 border-l border-black pl-1 space-y-1">
                                    {module.pages.map((page: any) =>
                                    {
                                        const PageIcon = page.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null

                                        return (
                                            <Link key={page.id} href={`/pages${page.link}`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted/60 transition">
                                                {PageIcon && <PageIcon className="w-4 h-4" />}
                                                <span>{page.title}</span>
                                            </Link>
                                        )
                                    })}
                                </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

             {/* FOOTER */}
             <div className={`h-16 flex items-center ${!collapsed ? "justify-end" : "justify-center"} px-4 border-b`}>
                <button onClick={() => setCollapsed(!collapsed)} className="p-2 cursor-pointer rounded-md hover:bg-muted/60 transition">
                    <PanelLeft className="w-4 h-4" />
                </button>
            </div>
        </motion.aside>
    );
}