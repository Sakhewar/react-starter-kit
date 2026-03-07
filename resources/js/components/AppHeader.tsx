import { router, useForm, usePage } from "@inertiajs/react"
import { Bell } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import MobileSidebar from "./MobileSideBar"
import { ThemeToggle } from "./ThemeToggle"

export default function AppHeader() {
    const { breadcrumb, auth } = usePage<{ breadcrumb?: string[]; auth: { user: { name: string } } }>().props

    const logout = () => {
        router.post('/logout');
    };

    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10">
            {/* Gauche */}
            <div className="flex items-center gap-4">
                <MobileSidebar />
                {/* Breadcrumb ou titre rapide si tu veux */}
                {breadcrumb && <div className="hidden md:block text-sm text-muted-foreground">{breadcrumb.join(' / ')}</div>}
            </div>

            {/* Droite */}
            <div className="flex items-center gap-3">

                <ThemeToggle />

                <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-lg transition">
                    <Avatar className="w-8 h-8">
                        <img src={auth?.user?.image}></img>
                    </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>Profil</DropdownMenuItem>
                    <DropdownMenuItem>Paramètres</DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                        Déconnexion
                        </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}