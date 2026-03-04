import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import AppSidebar from "./AppSideBar"


export default function MobileSidebar() {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger>
                    <Menu className="w-6 h-6" />
                </SheetTrigger>

                <SheetContent side="left" className="p-0 w-64">
                    <AppSidebar isMobile={true} />
                </SheetContent>
            </Sheet>
        </div>
    )
}