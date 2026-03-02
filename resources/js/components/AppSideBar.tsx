import { Link, usePage } from "@inertiajs/react"
import { motion } from "framer-motion"
import { useState } from "react"
import * as Icons from "lucide-react"

export default function AppSidebar() {
    const { menu } = usePage().props
    const [hovered, setHovered] = useState(false)
    const current = window.location.pathname

    return (
        <>
            <motion.aside
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                animate={{ width: hovered ? 240 : 72 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="hidden md:flex h-screen border-r bg-background flex-col"
            >
                <div className="h-16 flex items-center justify-center border-b">
                    <span className="font-semibold text-lg">
                        {hovered ? "MyApp" : "M"}
                    </span>
                </div>

                <div className="flex-1 px-2 py-4 space-y-4">
                    {menu.map((module) => (
                        <div key={module.id}>
                            {module.pages.map((page) => {
                                const active = current.startsWith(page.link)
                                const Icon = Icons[page.icon]

                                return (
                                    <Link
                                        key={page.id}
                                        href={page.link}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                                        ${active ? "bg-muted font-medium" : "hover:bg-muted/60"}`}
                                    >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        {hovered && page.title}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </motion.aside>
        </>
    )
}