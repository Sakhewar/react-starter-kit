import { usePage } from "@inertiajs/react"
import { Bell } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default function AppHeader() {
    const { breadcrumb, auth } = usePage<{ breadcrumb?: string[]; auth: { user: { name: string } } }>().props

    return (
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between">

            {/* Left */}
            <div>
                <div className="text-sm text-muted-foreground">
                    {breadcrumb?.join(" / ")}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">

                <Input placeholder="Search..." className="w-64" />

                <button className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarFallback>
                                {auth.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href="/logout">Logout</a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    )
}