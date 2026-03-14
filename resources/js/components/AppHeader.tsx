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
import { ThemeToggle } from "./partials/ThemeToggle"
import { useAuthStore } from "@/hooks/authStore"
import { PaletteProps } from "@/lib/utils"

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

export default function AppHeader({palette} : {palette:PaletteProps})
{
    const { breadcrumb, auth, notifications = 0 } = usePage<HeaderProps>().props
    const { afterLogout } = useAuthStore();
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
            style={{ background: palette.bg, borderBottom: `1px solid ${palette.border}` }}
        >
            {/* Gauche */}
            <div className="flex items-center gap-4">
                <MobileSidebar palette={palette} />
                {breadcrumb && (
                    <div className="hidden md:flex items-center gap-1 text-xs">
                        {breadcrumb.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1">
                                {i > 0 && (
                                    <span style={{ color: palette.border }}>/</span>
                                )}
                                <span style={{
                                    color: i === breadcrumb.length - 1 ? palette.textActive : palette.text,
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
                    style={{ color: palette.text }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = palette.bgHover
                        e.currentTarget.style.color = palette.textActive
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                        e.currentTarget.style.color = palette.text
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
                    style={{ background: palette.border }}
                />

                {/* Avatar + menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = palette.bgHover ?? ""
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent"
                            }}
                        >
                            <Avatar className="w-7 h-7">
                                <AvatarImage src={auth?.user?.image} alt={auth?.user?.name} />
                                <AvatarFallback
                                    className="text-xs font-bold"
                                    style={{ background: palette.bgActive, color: palette.textActive }}
                                >
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span
                                className="hidden md:block text-xs font-medium"
                                style={{ color: palette.text }}
                            >
                                {auth?.user?.name?.split(" ")[0]}
                            </span>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-48"
                        style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                    >
                        <DropdownMenuLabel className="font-normal">
                            <span
                                className="font-medium text-sm"
                                style={{ color: palette.textActive }}
                            >
                                {auth?.user?.name}
                            </span>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator style={{ background: palette.border }} />

                        <DropdownMenuItem
                            onClick={() => router.visit("/profil")}
                            className="cursor-pointer"
                            style={{ color: palette.text }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = palette.bgHover
                                ;(e.currentTarget as HTMLElement).style.color = palette.textActive
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent"
                                ;(e.currentTarget as HTMLElement).style.color = palette.text
                            }}
                        >
                            Profil
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => router.visit("/parametres")}
                            className="cursor-pointer"
                            style={{ color: palette.text }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = palette.bgHover
                                ;(e.currentTarget as HTMLElement).style.color = palette.textActive
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent"
                                ;(e.currentTarget as HTMLElement).style.color = palette.text
                            }}
                        >
                            Paramètres
                        </DropdownMenuItem>

                        <DropdownMenuSeparator style={{ background: palette.border }} />

                        <DropdownMenuItem
                            onClick={logout}
                            className="cursor-pointer"
                            style={{ color: palette.danger, border: `1px solid ${palette.danger}` }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = palette.dangerHover
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