import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { FieldSeparator } from "./ui/field"
import { Input } from "./ui/input"
import { DatePicker } from "./DatePicker"
import { Label } from "./ui/label"
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa"

export function MoreFilters({ open, onOpenChange, data, setData, handleSubmit }: { open: boolean, onOpenChange: (open: boolean) => void, data: any, setData: (data: any) => void, handleSubmit:any })
{
  return (
    <Drawer open={open} onOpenChange={()=>{onOpenChange(open)}} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Autres Filtres</DrawerTitle>
          <DrawerDescription>Vous pouvez appliquer d'autres filtres si besoin !</DrawerDescription>
          <FieldSeparator />
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 mt-5">
            <form onSubmit={(e) => {handleSubmit()}} className="space-y-4">
                <Input
                    type="text"
                    className="pr-9
                        [&::-webkit-search-cancel-button]:hidden
                        [&::-ms-clear]:hidden
                        rounded-md border border-gray-300 px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                    value={data?.search}
                    onChange={(e) => setData({ ...data, search: e.target.value })}
                    placeholder="Rechercher par libelle, description ..."
                    />
                    <DatePicker />
                    <DatePicker />

                    <div className="flex gap-2 items-center mt-10">
                        <Button size="sm" variant="link">
                            <FaRegFileExcel className="text-green-600 text-sm cursor-pointer hover:opacity-80 transition" />
                            Excel
                        </Button>
                        <Button size="sm" variant="link">
                            <FaRegFilePdf className="text-red-600 text-sm cursor-pointer hover:opacity-80 transition" />
                            Pdf
                        </Button>
                    </div>
            </form>
        </div>
        <DrawerFooter>
          <Button>Filter</Button>
          <Button variant="outline">Annuler</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
