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
import { DatePickerGloabal } from "./DatePicker"
import { Label } from "./ui/label"
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa"
import { useEffect, useState } from "react"
import { exportToPdfOrExcel } from "@/hooks/backoffice"
import { FieldConfig} from "@/lib/utils"
import { FieldRenderer } from "@/lib/utilsFunctiions"

export function MoreFilters({type,open, onOpenChange, data, setData, handleSubmit, reset, fields}: {fields?: FieldConfig[],type:string, open: boolean, onOpenChange: (open: boolean) => void, data: any, setData: (data: any) => void, handleSubmit:any, reset:any })
{
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  useEffect(() =>
  {
    if(dateStart.trim().length > 0)
    {
      setData({...data, date_start: dateStart})
    } 
    if(dateEnd.trim().length > 0)
    {
      setData({...data, date_end: dateEnd})
    } 
  },[dateStart, dateEnd])

  const handleChange = (name: string, value: any) =>
  { 
    setData({ ...data, [name]: value })
  };
  return (
    <Drawer open={open} onOpenChange={()=>{onOpenChange(open)}} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Autres Filtres</DrawerTitle>
          <DrawerDescription>Vous pouvez appliquer d'autres filtres si besoin !</DrawerDescription>
          <FieldSeparator />
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
            <form onSubmit={(e) => {e.preventDefault(), handleSubmit()}} className="space-y-4">
                {!fields || (fields && Array.isArray(fields) && fields.length === 0) &&
                <div className="space-y-4">
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
                    <DatePickerGloabal name="date_start" fieldLabel="Crée entre le :" value={dateStart}  onSelect={(t) =>{setDateStart(t)}} />
                    <DatePickerGloabal name="date_end" fieldLabel="Et le :"  value={dateEnd} onSelect={(t) =>{setDateEnd(t)}}/>
                  </div>
                }

                {fields && <div className="grid grid-cols-12 gap-y-6">
                  {fields.map(field => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      value={data[field.name]}
                      onChange={handleChange}
                    />
                  ))}
                </div>}

                <div className="flex gap-2 items-center mt-10 justify-end">
                    <span className="text-sm text-gray-500 mr-2">Exporter les données en </span>
                    <Button size="sm" type="button" variant="link" onClick={()=>{exportToPdfOrExcel(type, 'excel', data)}}>
                        <FaRegFileExcel className="text-green-600 text-sm cursor-pointer hover:opacity-80 transition" />
                        Excel
                    </Button>
                    <Button size="sm" type="button" variant="link" onClick={()=>{exportToPdfOrExcel(type, 'pdf', data)}}>
                        <FaRegFilePdf className="text-red-600 text-sm cursor-pointer hover:opacity-80 transition" />
                        Pdf
                    </Button>
                </div>
            </form>
        </div>
        <DrawerFooter>
          <Button className="cursor-pointer" onClick={handleSubmit}>Filter</Button>
          <Button className="cursor-pointer" onClick={()=>{setDateStart("");setDateEnd("");reset()}} variant="outline">Annuler</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
