"use client";

import * as React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Paperclip, X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addElement, toCapitalize } from "@/hooks/backoffice";
import { FieldSeparator } from "./ui/field";
import { DatePickerGloabal } from "./DatePicker";
import { toast } from "sonner";
import * as Icons from "lucide-react";

// ─── Maps statiques Tailwind ──────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FieldConfig {
  key?: string;
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date" | "file";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  accept?: string;
  multiple?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  colSpan?: number;
  mdColSpan?: number;
  lgColSpan?: number;
  xlColSpan?: number;
  tableMode?: boolean;
  fields?: FieldConfig[];
  // Unicité dans un tab tableMode
  is_unique?: boolean;       // ce champ doit être unique dans le tableau
}

export interface TabConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  tableMode?: boolean;
  fields: FieldConfig[];
}

interface ModalCreateGenericProps {
  page?: any;
  title: string;
  description?: string;
  entity: string;
  fields?: FieldConfig[];
  tabs?: TabConfig[];
  onSuccess?: (newItem: any) => void;
  updateItem?: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  return Object.fromEntries(fields.map(f => [f.name, f.defaultValue ?? ""]));
}

// ─── Vérification d'unicité ───────────────────────────────────────────────────

function checkUniqueness(
  fields: FieldConfig[],
  currentRow: Record<string, any>,
  existingRows: Record<string, any>[],
  key: string
): string | null
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

interface FieldRendererProps {
  field: FieldConfig;
  value: any;
  errors?: Record<string, string>;
  processing?: boolean;
  fileMap?: Record<string, File[]>;
  onFileChange?: (name: string, e: React.ChangeEvent<HTMLInputElement>, multiple?: boolean) => void;
  onChange: (name: string, value: any) => void;
  onRemoveFile?: (name: string, index: number) => void;
}

function FieldRenderer(
{
  field, value, onChange, errors = {}, processing = false,
  fileMap = {}, onFileChange, onRemoveFile,
}: FieldRendererProps) {
  return (
    <div className={cn("flex flex-col gap-2 min-w-0", buildColClass(field), field.containerClassName)}>
      {field.type !== "checkbox" && field.type !== "date" && (
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
        <Select
          value={value ?? ""}
          onValueChange={(val) => onChange(field.name, val)}
          disabled={processing}
        >
          <SelectTrigger className={cn("w-full", field.inputClassName)}>
            <SelectValue placeholder={field.placeholder ?? `Choisir ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <div className={cn("flex flex-col gap-2", field.inputClassName)}>
          <label
            htmlFor={field.name}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-input",
              "text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors",
              processing && "opacity-50 pointer-events-none"
            )}
          >
            <Paperclip className="h-4 w-4 shrink-0" />
            <span>{field.placeholder ?? "Choisir un fichier..."}</span>
            <input
              id={field.name}
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              disabled={processing}
              className="sr-only"
              onChange={(e) => onFileChange?.(field.name, e, field.multiple)}
            />
          </label>
          {(fileMap[field.name] ?? []).length > 0 && (
            <ul className="flex flex-col gap-1">
              {fileMap[field.name].map((file, i) => (
                <li key={i} className="flex items-center justify-between text-sm px-2 py-1 rounded-md bg-muted">
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveFile?.(field.name, i)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
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

// ─── Sous-composant : tab en mode tableau ─────────────────────────────────────

interface TableTabProps {
  tab: TabConfig;
  rows: Record<string, any>[];
  onAddRow: (tabKey: string, row: Record<string, any>) => void;
  onRemoveRow: (tabKey: string, index: number) => void;
  processing?: boolean;
}

function TableTab({ tab, rows, onAddRow, onRemoveRow, processing }: TableTabProps)
{
  const [currentRow, setCurrentRow] = React.useState<Record<string, any>>(
    emptyRowFromFields(tab.fields)
  );
  const [uniqueError, setUniqueError] = React.useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setUniqueError(null); // reset l'erreur dès qu'on modifie
    setCurrentRow(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const hasValue = Object.values(currentRow).some(v => v !== "" && v !== false && v != null);
    if (!hasValue) return;

    const violation = checkUniqueness(tab.fields, currentRow, rows, tab.key);
    if (violation)
    {
      toast.error(violation, {position: "top-center"});
      setUniqueError(violation);
      return;
    }

    setUniqueError(null);
    onAddRow(tab.key, currentRow);
    setCurrentRow(emptyRowFromFields(tab.fields));
  };

  // Colonnes visibles : exclut id et champs cachés
  const visibleFields = tab.fields.filter(f =>
    f.name !== "id" &&
    (!f.containerClassName || !f.containerClassName.includes("hidden"))
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Formulaire d'ajout */}
      <div className="grid grid-cols-12 gap-x-4 gap-y-4 items-end">
        {tab.fields.map(field => (
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
            variant="outline"
            onClick={handleAdd}
            disabled={processing}
            className="h-9 w-9 shrink-0 bg-cyan-50 border-cyan-300 hover:bg-cyan-100 text-cyan-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-md overflow-hidden border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a4a5c] text-white">
              {visibleFields.map(f => (
                <th key={f.name} className="px-4 py-3 text-left font-semibold uppercase text-xs tracking-wider">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleFields.length + 1}
                  className="px-4 py-6 text-center text-muted-foreground text-sm"
                >
                  Aucune ligne ajoutée
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/40 transition-colors">
                  {visibleFields.map(f => (
                    <td key={f.name} className="px-4 py-2.5 text-foreground">
                      {f.type === "checkbox"
                        ? (row[f.name] ? "✓" : "—")
                        : f.type === "select"
                          ? (f.options?.find(o => o.value === row[f.name])?.label ?? row[f.name])
                          : (row[f.name] || "—")}
                    </td>
                  ))}
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(tab.key, i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function ModalCreateGeneric(
{
  page, title, entity,
  fields: legacyFields,
  tabs: tabsProp,
  onSuccess, updateItem, isOpen, onOpenChange,
}: ModalCreateGenericProps)
{
  const PageIcon = page?.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;
  const resolvedTabs = React.useMemo<TabConfig[]>(() => {
    if (tabsProp && tabsProp.length > 0) return tabsProp;
    return [{
      key: "infos",
      label: "Infos Générales",
      fields: legacyFields ?? [],
    }];
  }, [tabsProp, legacyFields]);

  const showTabs = resolvedTabs.length > 1;
  const [activeTab, setActiveTab] = React.useState(resolvedTabs[0]?.key ?? "");

  const flatFields = React.useMemo(() => {
    const allFields: FieldConfig[] = [];
    resolvedTabs.forEach(tab => {
      if (!tab.tableMode)
      {
        tab.fields.forEach(f => {
          if (!allFields.some(existing => existing.name === f.name))
          {
            allFields.push(f);
          }
        });
      }
    });
    if (!allFields.some(f => f.name === "id"))
    {
      allFields.unshift({
        name: "id", label: "id", type: "number",
        defaultValue: "", containerClassName: "hidden",
      });
    }
    return allFields;
  }, [resolvedTabs]);

  const { data, setData, processing, errors, reset } = useForm(
    Object.fromEntries(flatFields.map(f => [f.name, f.defaultValue ?? ""]))
  );

  const [fileMap, setFileMap] = React.useState<Record<string, File[]>>({});
  const [tableRows, setTableRows] = React.useState<Record<string, Record<string, any>[]>>({});

  // Sync updateItem → form + lignes tableaux
  React.useEffect(() => {
    if (updateItem != null)
    {
      setData(Object.fromEntries(
        flatFields.map(f => [f.name, updateItem?.[f.name] ?? f.defaultValue ?? ""])
      ));
      // Sync lignes des tabs tableMode
      resolvedTabs.forEach(tab => {
        if (tab.tableMode && Array.isArray(updateItem[tab.key]))
        {
          setTableRows(prev => ({
            ...prev,
            [tab.key]: updateItem[tab.key],
          }));
        }
      });
    }
  }, [updateItem, flatFields]);

  React.useEffect(() => {
    if (isOpen) setActiveTab(resolvedTabs[0]?.key ?? "");
  }, [isOpen]);

  const handleChange = (name: string, value: any) => setData(name, value);

  const handleFileChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>, multiple?: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setFileMap(prev => ({
      ...prev,
      [fieldName]: multiple ? [...(prev[fieldName] ?? []), ...fileArray] : fileArray,
    }));
    setData(fieldName, fileArray.map(f => f.name).join(", "));
  };

  const handleRemoveFile = (fieldName: string, index: number) => {
    setFileMap(prev => {
      const updated = [...(prev[fieldName] ?? [])];
      updated.splice(index, 1);
      return { ...prev, [fieldName]: updated };
    });
    setData(fieldName, "");
  };

  const handleAddRow = (tabKey: string, row: Record<string, any>) => {
    setTableRows(prev => ({
      ...prev,
      [tabKey]: [...(prev[tabKey] ?? []), row],
    }));
  };

  const handleRemoveRow = (tabKey: string, index: number) => {
    setTableRows(prev => {
      const updated = [...(prev[tabKey] ?? [])];
      updated.splice(index, 1);
      return { ...prev, [tabKey]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hasFiles = Object.keys(fileMap).length > 0;
      let payload: any = { ...data };

      Object.entries(tableRows).forEach(([key, rows]) => {
        payload[key] = rows;
      });

      if (hasFiles)
      {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, val]) => {
          if (Array.isArray(val))
          {
            formData.append(key, JSON.stringify(val));
          } else
          {
            formData.append(key, val as string);
          }
        });
        Object.entries(fileMap).forEach(([key, files]) => {
          files.forEach(file => formData.append(key, file));
        });
        payload = formData;
      }

      const result = await addElement(`/${entity}`, payload);
      if (result?.data?.success)
      {
        onSuccess?.(result.data);
        handleClose(false);
      } else
      {
        console.error("Échec de la sauvegarde :", result);
      }
    } catch (err)
    {
      console.error("Erreur lors de la sauvegarde :", err);
    }
  };

  const handleClose = (val: boolean) => {
    onOpenChange(val);
    reset();
    setFileMap({});
    setTableRows({});
    setActiveTab(resolvedTabs[0]?.key ?? "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[60vw] max-h-[90vh] overflow-y-auto top-[50px] translate-y-0 mt-4 [&>button:last-of-type]:hidden"
      >
        {/* ── Header : titre à gauche + tabs à droite ── */}
        <DialogHeader className="flex flex-row items-center justify-between gap-4 pb-0">
          <DialogTitle className="shrink-0 flex items-center gap-2">
            {PageIcon && <PageIcon className="w-4 h-4" />}
            {toCapitalize(title)}
          </DialogTitle>

          {showTabs && (
            <div className="flex items-center gap-1">
              {resolvedTabs.map(tab => (
                <Button
                  key={tab.key}
                  type="button"
                  size="sm"
                  variant={"ghost"}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 h-8 px-3 text-xs font-medium cursor-pointer",
                    activeTab === tab.key ? "border-b-1 border-b-primary rounded-b-none" : ""
                  )}
                >
                  {tab.icon && (
                    <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{tab.icon}</span>
                  )}
                  {tab.label}
                </Button>
              ))}
            </div>
          )}
        </DialogHeader>

        <FieldSeparator />

        <form onSubmit={handleSubmit} className="py-2">
          {/* ── Contenu des tabs ── */}
          {resolvedTabs.map(tab => (
            <div
              key={tab.key}
              className={cn(tab.key !== activeTab && "hidden")}
            >
              {tab.tableMode ? (
                <TableTab
                  tab={tab}
                  rows={tableRows[tab.key] ?? []}
                  onAddRow={handleAddRow}
                  onRemoveRow={handleRemoveRow}
                  processing={processing}
                />
              ) : (
                <div className="grid grid-cols-12 gap-x-4 gap-y-6">
                  {tab.fields.map(field => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      value={data[field.name]}
                      onChange={handleChange}
                      errors={errors}
                      processing={processing}
                      fileMap={fileMap}
                      onFileChange={handleFileChange}
                      onRemoveFile={handleRemoveFile}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          <DialogFooter className="mt-8">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={processing}>
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Valider
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}