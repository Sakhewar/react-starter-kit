import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import AppSidebar from "./AppSideBar"
import { PaletteColors, PaletteProps } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"


export default function MobileSidebar({palette} : {palette:PaletteProps}) {
    return (
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="w-6 h-6" />
            </SheetTrigger>
    
            <SheetContent
              side="left"
              className="p-0 w-fit border-none"
              style={{ background: palette?.bg }}
            >
              {/* Titre caché pour les screen readers */}
              <VisuallyHidden>
                <SheetTitle>Menu de navigation</SheetTitle>
                <SheetDescription>Navigation principale de l'application</SheetDescription>
              </VisuallyHidden>
    
              <AppSidebar isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>
      )
}