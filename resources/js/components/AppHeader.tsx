import { router, usePage } from "@inertiajs/react"
import { Bell } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MobileSidebar from "./MobileSideBar"
import { ThemeToggle } from "./ThemeToggle"
import { useAuthStore } from "@/hooks/authStore"
import { PaletteColors } from "@/lib/utils"


type HeaderProps = {
    breadcrumb?: string[]
    auth: {
        user: {
            name: string
            image?: string
        }
    }
    notifications?: number
}

export default function AppHeader() {
    const { breadcrumb, auth, notifications = 0 } = usePage<HeaderProps>().props
    const { afterLogout } = useAuthStore()

    const logout = () => {
        router.post("/logout", {}, {
            onSuccess: () => afterLogout(),
        })
    }

    const initials = auth?.user?.name
        ?.split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")

    return (
        <header
            className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10"
            style={{ background: PaletteColors().bg, borderBottom: `1px solid ${PaletteColors().border}` }}
        >
            {/* Gauche */}
            <div className="flex items-center gap-4">
                <MobileSidebar />
                {breadcrumb && (
                    <div className="hidden md:flex items-center gap-1 text-xs">
                        {breadcrumb.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1">
                                {i > 0 && (
                                    <span style={{ color: PaletteColors().border }}>/</span>
                                )}
                                <span style={{
                                    color: i === breadcrumb.length - 1 ? PaletteColors().textActive : PaletteColors().text,
                                    fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                                }}>
                                    {crumb}
                                </span>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Droite */}
            <div className="flex items-center gap-1">

                <ThemeToggle />

                {/* Notifications */}
                <button
                    className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
                    style={{ color: PaletteColors().text }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = PaletteColors().bgHover
                        e.currentTarget.style.color = PaletteColors().textActive
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                        e.currentTarget.style.color = PaletteColors().text
                    }}
                >
                    <Bell className="w-4 h-4" />
                    {notifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </button>

                {/* Séparateur */}
                <div
                    className="w-px h-5 mx-2"
                    style={{ background: PaletteColors().border }}
                />

                {/* Avatar + menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = PaletteColors().bgHover
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent"
                            }}
                        >
                            <Avatar className="w-7 h-7">
                                <AvatarImage src={auth?.user?.image} alt={auth?.user?.name} />
                                <AvatarFallback
                                    className="text-xs font-bold"
                                    style={{ background: PaletteColors().bgActive, color: PaletteColors().textActive }}
                                >
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span
                                className="hidden md:block text-xs font-medium"
                                style={{ color: PaletteColors().text }}
                            >
                                {auth?.user?.name?.split(" ")[0]}
                            </span>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-48"
                        style={{ background: PaletteColors().bg, border: `1px solid ${PaletteColors().border}` }}
                    >
                        <DropdownMenuLabel className="font-normal">
                            <span
                                className="font-medium text-sm"
                                style={{ color: PaletteColors().textActive }}
                            >
                                {auth?.user?.name}
                            </span>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator style={{ background: PaletteColors().border }} />

                        <DropdownMenuItem
                            onClick={() => router.visit("/profil")}
                            className="cursor-pointer"
                            style={{ color: PaletteColors().text }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = PaletteColors().bgHover
                                ;(e.currentTarget as HTMLElement).style.color = PaletteColors().textActive
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent"
                                ;(e.currentTarget as HTMLElement).style.color = PaletteColors().text
                            }}
                        >
                            Profil
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => router.visit("/parametres")}
                            className="cursor-pointer"
                            style={{ color: PaletteColors().text }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = PaletteColors().bgHover
                                ;(e.currentTarget as HTMLElement).style.color = PaletteColors().textActive
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent"
                                ;(e.currentTarget as HTMLElement).style.color = PaletteColors().text
                            }}
                        >
                            Paramètres
                        </DropdownMenuItem>

                        <DropdownMenuSeparator style={{ background: PaletteColors().border }} />

                        <DropdownMenuItem
                            onClick={logout}
                            className="cursor-pointer"
                            style={{ color: "#f87171" }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent"
                            }}
                        >
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}