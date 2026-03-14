import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Paperclip, X, Plus, Trash2, Table, ChevronsUpDown, Check, Settings, ChevronDown, ThumbsDown, ThumbsUp, Loader2 } from "lucide-react";
import { Action, ActionsConfig, cn, FieldConfig, FieldGroup, FieldRendererProps, TableTabProps } from "@/lib/utils";
import { addElement, can, changeStatut, deleteElement, showToast, toCapitalize, updateElement} from "@/hooks/backoffice";
import { DatePickerGloabal } from "@/components/partials/DatePicker";
import { toast } from "sonner";
import * as TableShadCn from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { RadioGroupField } from "@/components/partials/RadioGroupMultiple";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { baseActions, columnConfigs } from "@/configs/listOfColumnTables";
import { useGlobalStore } from "@/utils/fetchDataScope";


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



export function groupFields(fields: FieldConfig[]): FieldGroup[] {
  const result: FieldGroup[] = [];
  const groupMap = new Map<string, FieldGroup & { kind: "grouped" }>();

  for (const field of fields) {
    if (field.group) {
      if (!groupMap.has(field.group)) {
        const g: FieldGroup & { kind: "grouped" } = {
          kind: "grouped",
          groupCol:   field.groupCol   ?? 12,
          mdGroupCol: field.mdGroupCol,
          lgGroupCol: field.lgGroupCol,
          xlGroupCol: field.xlGroupCol,
          fields: [],
        };
        groupMap.set(field.group, g);
        result.push(g);
      }
      groupMap.get(field.group)!.fields.push(field);
    } else {
      result.push({ kind: "solo", field });
    }
  }

  return result;
}

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
            rows={field.nbRowsTextArea ?? 3}
            style={{ height: `${(field.nbRowsTextArea ?? 3) * 24}px` }}
            onChange={(e) => onChange(field.name, e.target.value)}
            disabled={processing}
            className={field.inputClassName}
            />
        ) : field.type === "select" ? (
                <Select2
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

function Select3({ field, value, onChange, processing }: {field :FieldConfig; value :any; onChange :(name: string, value: any) => void; processing?: boolean;})
{
  const [open, setOpen]                 = React.useState(false);
  const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>();
  const { dataPage }                    = useGlobalStore();
  const triggerRef                      = React.useRef<HTMLButtonElement>(null);

  const options = React.useMemo(
    () => (field.options != null ? dataPage[field.options] : []) as { id: any; libelle: string }[],
    [dataPage, field.options]
  );

  const placeholder = field.placeholder ?? toCapitalize(field.label.toLowerCase());

  const selectedLabel = React.useMemo(
    () => options?.find(opt => String(opt.id) === String(value))?.libelle,
    [options, value]
  );

  const handleSelect = React.useCallback((id: string) =>
  {
    onChange(field.name, id);
    setOpen(false);
  }, [field.name, onChange]);

  const handleClear = React.useCallback(() =>
  {
    onChange(field.name, "");
    setOpen(false);
  }, [field.name, onChange]);

  return (
    <Popover open = {open}
      onOpenChange = {(isOpen) =>
        {
        if (isOpen) setPopoverWidth(triggerRef.current?.offsetWidth);
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          ref       = {triggerRef}
          type      = "button"
          variant   = "outline"
          role      = "combobox"
          disabled  = {processing}
          className = {cn("w-full justify-between font-normal", field.inputClassName)}
        >
          {selectedLabel ?? placeholder}
          <ChevronsUpDown className = "ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style = {{ width: popoverWidth ?? "auto" }} className = "p-0" align = "start">
        <Command>
          <CommandInput placeholder = "Rechercher..." />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup>
              <CommandItem value     = "__none__" onSelect = {handleClear}>
              <span        className = "text-muted-foreground">{placeholder}</span>
              </CommandItem>
              {options?.map((opt) => (
                <CommandItem
                  key      = {opt.id}
                  value    = {opt.libelle} 
                  onSelect = {() => handleSelect(String(opt.id))}
                >
                  <Check className={cn(
                    "mr-2 h-4 w-4",
                    String(value) === String(opt.id) ? "opacity-100" : "opacity-0"
                  )} />
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

function Select2({field, value, onChange, processing} : {field : FieldConfig, value: any, onChange   : (name: string, value: any) => void,processing?: boolean})
{
  const [open, setOpen]                   = React.useState(false)
  const [popoverWidth, setPopoverWidth]   = React.useState<number | undefined>()
  const [creating, setCreating]           = React.useState(false)
  const [search, setSearch]               = React.useState("")
  const { dataPage }                      = useGlobalStore()
  const triggerRef                        = React.useRef<HTMLButtonElement>(null)

  const options = React.useMemo(
    () => (field.options != null ? dataPage[field.options] : []) as { id: any; libelle: string }[],
    [dataPage, field.options]
  )

  const placeholder   = field.placeholder ?? toCapitalize(field.label.toLowerCase())
  const selectedLabel = React.useMemo(
    () => options?.find((opt) => String(opt.id) === String(value))?.libelle,
    [options, value]
  )

  // ── Vérifie si la recherche correspond exactement à une option ──
  const exactMatch = React.useMemo(
    () => options?.some(
      (opt) => opt.libelle.toLowerCase() === search.toLowerCase()
    ),
    [options, search]
  )

  const showCreateButton = search.trim().length > 0 && !exactMatch

  // ── Handlers ─────────────────────────────────────

  const handleSelect = React.useCallback((id: string) =>
  {
    onChange(field.name, id)
    setOpen(false)
    setSearch("")
  }, [field.name, onChange])

  const handleClear = React.useCallback(() =>
  {
    onChange(field.name, "")
    setOpen(false)
    setSearch("")
  }, [field.name, onChange])

  const handleCreate = React.useCallback(async () =>
  {
    if (!field.createIfEmpty) return
    if (!field.endpoint || !search.trim()) return
    setCreating(true)

    try
    {
      const endpoint = `/${field.endpoint}`
      const result   = await addElement(endpoint, { libelle: search.trim() }, false)

      if(result && result?.data)
      {
        if(!result?.data?.success)
        {
          setCreating(false);
          showToast(result?.data?.message || "Une erreur est survenue", "error")
        }
        else
        {
          
        }
      }

      console.log("result", result);
      

      // if (result?.data?.success) {
      //   // Recharge les options depuis le store
      //   // Le store doit se mettre à jour via initialize
      //   // On sélectionne directement par libelle après rechargement
      //   //const newOptions = (useGlobalStore.getState().dataPage[field.options] ?? []) as { id: any; libelle: string }[]
      //   const created    = newOptions.find(
      //     (opt) => opt.libelle.toLowerCase() === search.trim().toLowerCase()
      //   )
      //   if (created) {
      //     onChange(field.name, String(created.id))
      //   }
      //   setOpen(false)
      //   setSearch("")
      // }
    } catch (err) {
      console.error("Erreur création :", err)
    } finally {
      setCreating(false)
    }
  }, [field.options, field.name, search, onChange])

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen)  setPopoverWidth(triggerRef.current?.offsetWidth)
        if (!isOpen) setSearch("")
        setOpen(isOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          role="combobox"
          disabled={processing}
          className={cn("w-full justify-between font-normal", field.inputClassName)}
        >
          {selectedLabel ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        style={{ width: popoverWidth ?? "auto" }}
        className="p-0"
        align="start"
      >
        <Command filter={(val, ss) => val.toLowerCase().includes(ss.toLowerCase()) ? 1 : 0}>
          <CommandInput
            placeholder="Rechercher..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {showCreateButton ? (
                <div  className       = "flex items-center justify-between px-3 py-2 gap-2">
                <span className       = "text-xs text-muted-foreground truncate">
                Créer <span className = "font-medium">"{search.trim()}"</span> ?
                  </span>
                  <button
                    type      = "button"
                    disabled  = {creating}
                    onClick   = {handleCreate}
                    className = "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all flex-shrink-0"
                    style     = {{
                      background: creating ? "rgba(34,197,94,0.1)": "rgba(34,197,94,0.15)",
                      color     : "#22c55e",
                      border    : "1px solid rgba(34,197,94,0.3)",
                    }}
                    onMouseEnter={(e) =>
                    {
                      if (!creating) e.currentTarget.style.background = "rgba(34,197,94,0.25)"
                    }}
                    onMouseLeave={(e) =>
                    {
                      if (!creating) e.currentTarget.style.background = "rgba(34,197,94,0.15)"
                    }}
                  >
                    {creating ? <Loader2 className = "h-3 w-3 animate-spin" /> : <Check   className = "h-3 w-3" />}
                    {creating ? "Création..." : "Oui"}
                  </button>
                </div>
              ) : (
                "Aucun résultat."
              )}
            </CommandEmpty>

            <CommandGroup>
              {/* Option vide */}
              <CommandItem value="__none__" onSelect={handleClear} forceMount style={{ display: search.trim().length > 0 ? "none" : undefined }}>
                <span className="text-muted-foreground">{placeholder}</span>
              </CommandItem>

              {options?.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.libelle}
                  onSelect={() => handleSelect(String(opt.id))}
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

              {/* Bouton créer en bas de liste si options existantes */}
              {showCreateButton && options.length > 0 && (
                <>
                  <div className="mx-2 my-1 h-px bg-border" />
                  <CommandItem
                    value="__create__"
                    disabled={creating}
                    onSelect={handleCreate}
                    className="gap-2 text-xs"
                  >
                    {creating
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Plus    className="h-3.5 w-3.5" />
                    }
                    {creating ? "Création en cours..." : `Créer "${search.trim()}"`}
                  </CommandItem>
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
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

  // ─── Hook partagé ────────────────────────────────────

  export function useRowActions(
    row           : any,
    attributeName : string,
    namepage     ?: string,
    config        : ActionsConfig = {},
    extraActions  : Action[] = []
    )             : Action[] {
      const hasColumnActiver = columnConfigs[attributeName]?.some(
        (col) => col.key === "activer"
      );
    
      const shouldShowBase = (key: keyof typeof baseActions): boolean => {
        const rule = config[key];
        if (rule === undefined) return true;
        if (typeof rule === "boolean") return rule;
        return rule(row);
      };
    
      const baseVisible: Action[] = Object.entries(baseActions)
        .filter(([key]) => shouldShowBase(key as keyof typeof baseActions))
        .map(([key, action]) => ({
          key,
          ...action,
          onClick: () => {
            if (key === "delete") {
              useGlobalStore.setState((state) => ({
                scope: {
                  ...state.scope,
                  itemToChange: {
                    changedItem: row,
                    title      : `Suppression ${toCapitalize(namepage ?? "")}`,
                    description: "Voulez-vous vraiment effectuer la suppression ?",
                    confirmText: "Oui Supprimer",
                    onConfirm  : async () => deleteElement(attributeName, row?.id),
                  },
                },
              }));
            } else if (key === "edit" || key === "clone") {
              updateElement(attributeName, row.id).then((data) => {
                if (key === "clone") {
                  data.id = null;
                  Object.keys(data).forEach((k) => {
                    if (Array.isArray(data[k])) {
                      data[k] = data[k].map((item: any) => {
                        delete item.id;
                        return item;
                      });
                    }
                  });
                }
                useGlobalStore.setState((state) => ({ ...state, updateItem: data }));
              });
            }
          },
        }));
    
      const extraWithActiver = [...extraActions];
    
      if (hasColumnActiver) {
        extraWithActiver.push({
          key  : "activer",
          label: row.activer == 1 ? "Désactiver": "Activer",
          icon : row.activer == 1
          ?       <ThumbsDown className  = "mr-2 text-red-600" />
          :       <ThumbsUp className    = "mr-2 text-green-600" />,
          variant: row.activer          == 1 ? "destructive" : "success",
          condition: () => can("statut-" + (attributeName ?? "default")),
          onClick  : (r) => {
            useGlobalStore.setState((state) => ({
              scope: {
                ...state.scope,
                itemToChange: {
                  changedItem: r,
                  title      : (r.activer == 1 ? "Désactiver" : "Activer") + " cet élément",
                  description: 
                    "Voulez-vous vraiment procéder à " +
                    (r.activer == 1 ? "la désactivation" : "l'activation") + " ?",
                  confirmText: "Oui " + (r.activer == 1 ? "Désactiver" : "Activer"),
                  onConfirm  : async () =>
                    changeStatut(
                      attributeName ?? "",
                      { id: r.id, status: r.activer == 1 ? 0 : 1 },
                      null,
                      namepage?.slice(0, -1) + " " +
                      (r.activer == 1 ? "désactivé" : "activé") + " avec succès"
                    ),
                },
              },
            }));
          },
        });
      }
    
      const extraVisible = extraWithActiver.filter(
        (act) => !act.condition || act.condition(row)
      );
    
      const all = [...baseVisible, ...extraVisible];
    
      return [
        ...all.filter((a) => a.key !== "delete"),
        ...all.filter((a) => a.key === "delete"),
      ];
    }
    
      // ─── RowActions component ─────────────────────────────
    
    export const RowActions = ({
      config       = {},
      extraActions = [],
      row,
      attributeName,
      namepage,
    }: {
      config       ?: ActionsConfig;
      extraActions ?: Action[];
      row           : any;
      attributeName : string;
      namepage     ?: string;
    }) => {
      const sortedActions = useRowActions(row, attributeName, namepage, config, extraActions);
    
      if (sortedActions.length === 0) return null;
    
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button      size      = "sm" variant = "ghost">
            <Settings    className = "h-4 w-4" />
            <ChevronDown className = "h-3 w-3 opacity-70 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortedActions.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key       = {action.key}
                  className = {
                    action.variant === "destructive"
                      ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                      : action.variant === "success"
                      ? "text-green-600 focus:bg-green-50 focus:text-green-600"
                      :  ""
                  }
                  onClick = {() => action.onClick?.(row)}
                >
                  {React.isValidElement(Icon) ? Icon : Icon && <Icon className="mr-2 h-4 w-4" />}
                  <span className={
                      action.variant === "destructive" ? "text-destructive"
                    : action.variant === "success"   ? "text-green-600"
                    :  ""
                  }>
                    {action.label}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };