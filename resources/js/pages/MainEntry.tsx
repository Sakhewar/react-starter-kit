import { usePage } from "@inertiajs/react"


import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"
import MobileSidebar from "@/components/MobileSideBar"
import { ThemeToggle } from "@/components/ThemeToggle"
import AppSidebar from "@/components/AppSideBar"


import * as Views from './views'; 


export default function MAinEntry() {
  const { namepage, modules, prefixepermission, page, requestData } = usePage().props;
  const { auth, breadcrumb } = usePage<{ auth: { user: { name: string } }, breadcrumb: string[] }>().props

  // 🔹 récupérer dynamiquement le composant
  const DynamicComponent = Views[namepage] || Views.Unauthorized;


    return (
        <div className="min-h-screen bg-background flex">

            {/* Desktop Sidebar */}
            <AppSidebar/>

            <div className="flex flex-col flex-1">

                {/* Header */}
                <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">

                    {/* Left section */}
                    <div className="flex items-center gap-4">

                        {/* Mobile menu button */}
                        <MobileSidebar />

                        {/* Breadcrumb */}
                        <div className="hidden md:flex text-sm text-muted-foreground">
                            {breadcrumb?.length > 0 ? (
                                breadcrumb.map((item, index) => (
                                    <span key={index} className="flex items-center">
                                        {index !== 0 && (
                                            <span className="mx-2">/</span>
                                        )}
                                        <span className="font-medium text-foreground">
                                            {item}
                                        </span>
                                    </span>
                                ))
                            ) : (
                                <span>Dashboard</span>
                            )}
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-3">

                        {/* Search (desktop only) */}
                        <div className="hidden lg:block">
                            <Input
                                placeholder="Search..."
                                className="w-64"
                            />
                        </div>

                        {/* Theme toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-lg transition">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>
                                            {auth?.user?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href="/logout">
                                        Logout
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-auto">
                  <DynamicComponent
                    prefixepermission={prefixepermission}
                    page={page}
                    requestData={requestData}
                  />
                </main>

            </div>
        </div>
    )
}