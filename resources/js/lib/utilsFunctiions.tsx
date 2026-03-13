import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Paperclip, X, Plus, Trash2, Table, ChevronsUpDown, Check } from "lucide-react";
import { cn, FieldConfig, FieldRendererProps, TableTabProps } from "@/lib/utils";
import { toCapitalize, useGlobalStore } from "@/hooks/backoffice";
import { DatePickerGloabal } from "@/components/DatePicker";
import { toast } from "sonner";
import * as TableShadCn from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { RadioGroupField } from "@/components/RadioGroupMultiple";


const colSpanMap: Record<number, string> = {
  1: "col-span-1",   2: "col-span-2",   3: "col-span-3",
  4: "col-span-4",   5: "col-span-5",   6: "col-span-6",
  7: "col-span-7",   8: "col-span-8",   9: "col-span-9",
  10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
};
const mdColSpanMap: Record<number, string> = {
  1: "md:col-span-1",   2: "md:col-span-2",   3: "md:col-span-3",
  4: "md:col-span-4",   5: "md:col-span-5",   6: "md:col-span-6",
  7: "md:col-span-7",   8: "md:col-span-8",   9: "md:col-span-9",
  10: "md:col-span-10", 11: "md:col-span-11", 12: "md:col-span-12",
};
const lgColSpanMap: Record<number, string> = {
  1: "lg:col-span-1",   2: "lg:col-span-2",   3: "lg:col-span-3",
  4: "lg:col-span-4",   5: "lg:col-span-5",   6: "lg:col-span-6",
  7: "lg:col-span-7",   8: "lg:col-span-8",   9: "lg:col-span-9",
  10: "lg:col-span-10", 11: "lg:col-span-11", 12: "lg:col-span-12",
};
const xlColSpanMap: Record<number, string> = {
  1: "xl:col-span-1",   2: "xl:col-span-2",   3: "xl:col-span-3",
  4: "xl:col-span-4",   5: "xl:col-span-5",   6: "xl:col-span-6",
  7: "xl:col-span-7",   8: "xl:col-span-8",   9: "xl:col-span-9",
  10: "xl:col-span-10", 11: "xl:col-span-11", 12: "xl:col-span-12",
};

function buildColClass(field: FieldConfig)
{
  return cn(
    colSpanMap[field.colSpan ?? 12],
    field.mdColSpan ? mdColSpanMap[field.mdColSpan] : "",
    field.lgColSpan ? lgColSpanMap[field.lgColSpan] : "",
    field.xlColSpan ? xlColSpanMap[field.xlColSpan] : "",
  );
}

function emptyRowFromFields(fields: FieldConfig[])
{
  if(!Array.isArray(fields)) return {};
  return Object.fromEntries(fields.map(f => [f.name, f.defaultValue ?? ""]));
}

function checkUniqueness(fields: FieldConfig[], currentRow: Record<string, any>, existingRows: Record<string, any>[],key: string): string | null
{
  const uniqueFields = fields.filter(f => f.is_unique);
  if (uniqueFields.length === 0) return null;

  const isDuplicate = existingRows.some(row =>
    uniqueFields.every(f => {
      const a = String(row[f.name] ?? "").trim().toLowerCase();
      const b = String(currentRow[f.name] ?? "").trim().toLowerCase();
      return a !== "" && a === b;
    })
  );

  if (isDuplicate)
  {
    const labels = uniqueFields.map(f => f.label).join(" -- ");
    return uniqueFields.length === 1
      ? `Onglet ${toCapitalize(key)} : ${labels} existe déjà dans le tableau`
      : `Onglet ${toCapitalize(key)} : ${labels} existent déjà dans le tableau`;
  }

  return null;
}

// ─── Sous-composant : rendu d'un champ ───────────────────────────────────────



export function FieldRenderer({field, value, onChange, errors = {}, processing = false,fileMap = {}, onFileChange, onRemoveFile}: FieldRendererProps)
{
  const {updateItem} = useGlobalStore();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(updateItem != null ? updateItem[field.name] : null);
    return (
        <div className={cn("flex flex-col gap-2 min-w-0", buildColClass(field), field.containerClassName)}>
        {!["checkbox", "date", "radio-group"].includes(field.type ?? "") && (
            <Label
            htmlFor={field.name}
            className={cn(
                "text-sm font-medium",
                field.required && "after:content-['*'] after:text-red-500 after:ml-1",
                field.labelClassName
            )}
            >
            {field.label}
            </Label>
        )}

        {field.type === "textarea" ? (
            <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            disabled={processing}
            className={field.inputClassName}
            />
        ) : field.type === "select" ? (
                <SearchableSelect
                    field={field}
                    value={value}
                    onChange={onChange}
                    processing={processing}
                />
        ) : field.type === "checkbox" ? (
            <div className="flex items-center gap-2">
            <Checkbox
                id={field.name}
                checked={!!value}
                onCheckedChange={(checked) => onChange(field.name, !!checked)}
                disabled={processing}
                className={field.inputClassName}
            />
            <Label htmlFor={field.name} className={cn("text-sm cursor-pointer", field.labelClassName)}>
                {field.label}
            </Label>
            </div>
        ) : field.type === "date" ? (
            <DatePickerGloabal
            fieldLabel={field.label}
            name={field.name}
            value={value ?? ""}
            onSelect={(date) => onChange(field.name, date)}
            />
        ) : field.type === "file" ? (
              <div className={cn("flex flex-col items-center gap-4", field.inputClassName)}>
                <div className="relative">
                  <label
                    htmlFor={field.name}
                    className={cn(
                      "relative flex flex-col items-center justify-center",
                      "w-25 h-25 rounded-full border-1 border-dashed border-input",
                      "text-sm text-muted-foreground cursor-pointer overflow-hidden",
                      "hover:border-primary hover:bg-muted/40 transition-all duration-200",
                      processing && "opacity-50 pointer-events-none",
                      field.labelClassName
                    )}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Aperçu"
                        className="absolute inset-0 w-full h-full object-contain object-center"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 px-4 text-center">
                        <Paperclip className="h-4 w-4 shrink-0" />
                        <span className="text-xs leading-tight">
                          {field.placeholder ?? "Choisir un fichier..."}
                        </span>
                      </div>
                    )}
                    <input
                      id={field.name}
                      type="file"
                      accept={field.accept}
                      multiple={field.multiple}
                      disabled={processing}
                      className="sr-only"
                      onChange={(e) => {
                        onFileChange?.(field.name, e, field.multiple);
                        const file = e.target.files?.[0];
                        if (file && file.type.startsWith("image/")) {
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>

                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        // Reset the input value
                        const input = document.getElementById(field.name) as HTMLInputElement;
                        if (input) input.value = "";
                        onRemoveFile?.(field.name, 0);
                        //onFileChange?.(field.name, null, field.multiple);
                      }}
                      className={cn(
                        "absolute -top-1 -right-1",
                        "w-6 h-6 rounded-full bg-destructive text-destructive-foreground",
                        "flex items-center justify-center shadow-md",
                        "hover:bg-destructive/80 transition-colors",
                        "border-2 border-background"
                      )}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
        ) : field.type === "radio-group" ? (
               <RadioGroupField
                 name={field.name}
                 value={value ?? null}
                 onChange={onChange}
                 radioOptions={field.radioOptions ?? []}
                 radioStyle={field.radioStyle}
                 activeClassName={field.activeClassName}
                 inactiveClassName={field.inactiveClassName}
                 disabled={processing}
                 label={field.label}
                 labelClassName={field.labelClassName}
                 required={field.required}
               />
           ): (
            <Input
            id={field.name}
            type={field.type ?? "text"}
            placeholder={field.placeholder}
            autoComplete="off"
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            disabled={processing}
            className={field.inputClassName}
            />
        )}

        {errors[field.name] && (
            <p className={cn("text-sm text-destructive", field.errorClassName)}>
            {errors[field.name]}
            </p>
        )}
        </div>
    );
}

function SearchableSelect({ field, value, onChange, processing }: {
    field: FieldConfig;
    value: any;
    onChange: (name: string, value: any) => void;
    processing?: boolean;
  }) {
    const [open, setOpen] = React.useState(false);
    const {dataPage} = useGlobalStore();

    const options = field.options != null ? dataPage[field.options] : [];
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            disabled={processing}
            className={cn("w-full justify-between font-normal", field.inputClassName)}
          >
            {value
              ? Array.isArray(options) && options.find(opt => String(opt.id) === String(value))?.libelle
              : (field.placeholder ?? `${toCapitalize(field.label.toLowerCase())}`)}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher..." />
            <CommandList>
              <CommandEmpty>Aucun résultat.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="__none__"
                  onSelect={() => {
                    onChange(field.name, "");
                    setOpen(false); // ← ferme
                  }}
                >
                  <span className="text-muted-foreground">
                    {field.placeholder ?? `${toCapitalize(field.label.toLowerCase())}`}
                  </span>
                </CommandItem>
                {Array.isArray(options) && options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={String(opt.id)}
                    onSelect={() => {
                      onChange(field.name, String(opt.id));
                      setOpen(false); // ← ferme
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        String(value) === String(opt.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.libelle}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

// ─── Sous-composant : tab en mode tableau ─────────────────────────────────────



export function TableTab({ tab, rows, onAddRow, onRemoveRow, processing }: TableTabProps)
{
  const [currentRow, setCurrentRow] = React.useState<Record<string, any>>(
    emptyRowFromFields(tab.fields as FieldConfig[])
  );
  const [uniqueError, setUniqueError] = React.useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setUniqueError(null); // reset l'erreur dès qu'on modifie
    setCurrentRow(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const hasValue = Object.values(currentRow).some(v => v !== "" && v !== false && v != null);
    if (!hasValue) return;

    const violation = checkUniqueness(tab.fields as FieldConfig[], currentRow, rows, tab.key);
    if (violation)
    {
      toast.error(violation, {position: "top-center"});
      setUniqueError(violation);
      return;
    }

    setUniqueError(null);
    onAddRow(tab.key, currentRow);
    setCurrentRow(emptyRowFromFields(tab.fields as FieldConfig[]));
  };

  // Colonnes visibles : exclut id et champs cachés
  const visibleFields =Array.isArray(tab.fields) && tab.fields.filter(f =>
    f.name !== "id" &&
    (!f.containerClassName || !f.containerClassName.includes("hidden"))
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Formulaire d'ajout */}
      <div className="grid grid-cols-12 gap-x-4 gap-y-4 items-end">
        {Array.isArray(tab.fields) && tab.fields.map(field => (
          <FieldRenderer
            key={field.name}
            field={
              field.name === "id"
                ? { ...field, containerClassName: "hidden" }
                : field
            }
            value={currentRow[field.name]}
            onChange={handleChange}
            processing={processing}
          />
        ))}
        {/* Bouton + */}
        <div className="col-span-12 md:col-span-1 flex items-end pb-0.5">
          <Button
            type="button"
            size="icon"
            variant="default"
            onClick={handleAdd}
            disabled={processing}
            className="h-9 w-9 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-md overflow-hidden border border-border">
        <TableShadCn.Table>
            <TableShadCn.TableHeader>
                <TableShadCn.TableRow className="bg-black hover:bg-black">
                {Array.isArray(visibleFields) && visibleFields.map((f) => (
                    <TableShadCn.TableHead key={f.name} className={cn("text-center text-white")}>
                    {f.label}
                    </TableShadCn.TableHead>
                ))}
                <TableShadCn.TableHead className="text-white text-center">#</TableShadCn.TableHead>
                </TableShadCn.TableRow>
                
            </TableShadCn.TableHeader>

            <TableShadCn.TableBody>
            {rows.length === 0 ? (
              <TableShadCn.TableRow className="bg-white">
                <TableShadCn.TableCell colSpan={Array.isArray(visibleFields) ? visibleFields.length : 0} className="text-center">
                  Aucune ligne ajoutée
                </TableShadCn.TableCell>
              </TableShadCn.TableRow>
            ): (
              rows.map((row, i) => (
                <TableShadCn.TableRow key={i} className="bg-white hover:bg-gray-100">
                  {Array.isArray(visibleFields) && visibleFields.map(f => (
                    <TableShadCn.TableCell key={f.name} className="text-center">
                       {f.type === "checkbox"
                        ? (row[f.name] ? "✓" : "—")
                        : f.type === "select"
                          ? ((Array.isArray(f.options) ? f.options : []).find(o => o.libelle === row[f.name])?.libelle ?? row[f.name])
                          : (row[f.name] || "—")}
                    </TableShadCn.TableCell>)
                  )}
                  <TableShadCn.TableCell className="text-center px-4 py-2.5">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onRemoveRow(tab.key, i)}
                        className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  </TableShadCn.TableCell>
                </TableShadCn.TableRow>
              ))
            )
          }
            </TableShadCn.TableBody>
        </TableShadCn.Table>
      </div>
    </div>
  );
}