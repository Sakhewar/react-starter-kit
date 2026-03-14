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

// ─── Types ───────────────────────────────────────────

type HeaderProps = {
    breadcrumb?: string[];
    auth: {
        user: {
            name: string;
            image?: string;
        };
    };
    notifications?: number;
};

// ─── Composant ───────────────────────────────────────

export default function AppHeader() {
    const { breadcrumb, auth, notifications = 0 } =
        usePage<HeaderProps>().props;

    const { afterLogout } = useAuthStore();

    const logout = () => {
        router.post("/logout", {}, {
            onSuccess: () => afterLogout(),
        });
    };

    const initials = auth?.user?.name
        ?.split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");

    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10">

            {/* Gauche */}
            <div className="flex items-center gap-4">
                <MobileSidebar />
                {breadcrumb && (
                    <div className="hidden md:block text-sm text-muted-foreground">
                        {breadcrumb.join(" / ")}
                    </div>
                )}
            </div>

            {/* Droite */}
            <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* Notifications */}
                <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </button>

                {/* Avatar + menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-lg transition">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={auth?.user?.image} alt={auth?.user?.name} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-sm">{auth?.user?.name}</span>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => router.visit("/profil")}>
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.visit("/parametres")}>
                            Paramètres
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={logout}
                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}