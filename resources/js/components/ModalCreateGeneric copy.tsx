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
import { Loader2, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { addElement } from "@/hooks/backoffice";
import { FieldSeparator } from "./ui/field";
import { DatePickerGloabal } from "./DatePicker";  // adapte le chemin

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
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date" | "file";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  // fichier
  accept?: string;       // ex: "image/*", ".pdf,.doc"
  multiple?: boolean;    // autoriser plusieurs fichiers
  // classes
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  // layout
  colSpan?: number;
  mdColSpan?: number;
  lgColSpan?: number;
  xlColSpan?: number;
}

interface ModalCreateGenericProps {
  title: string;
  description?: string;
  entity: string;
  fields: FieldConfig[];
  onSuccess?: (newItem: any) => void;
  updateItem?: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function ModalCreateGeneric({
  title,
  entity,
  fields,
  onSuccess,
  updateItem,
  isOpen,
  onOpenChange,
}: ModalCreateGenericProps) {

  const normalizedFields = React.useMemo<FieldConfig[]>(() => {
    const idField: FieldConfig = {
      name: "id",
      label: "id",
      type: "number",
      defaultValue: "",
      colSpan: 12,
      containerClassName: "hidden",
      labelClassName: "hidden",
      inputClassName: "hidden",
    };
    return fields.some(f => f.name === "id") ? fields : [idField, ...fields];
  }, [fields]);

  const { data, setData, processing, errors, reset } = useForm(
    Object.fromEntries(normalizedFields.map(f => [f.name, f.defaultValue ?? ""]))
  );

  // Fichiers sélectionnés (stockés séparément car pas sérialisables)
  const [fileMap, setFileMap] = React.useState<Record<string, File[]>>({});

  React.useEffect(() => {
    if (updateItem != null) {
      setData(
        Object.fromEntries(
          normalizedFields.map(f => [f.name, updateItem?.[f.name] ?? f.defaultValue ?? ""])
        )
      );
    }
  }, [updateItem, normalizedFields]);

  const handleFileChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>, multiple?: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setFileMap(prev => ({
      ...prev,
      [fieldName]: multiple ? [...(prev[fieldName] ?? []), ...fileArray] : fileArray,
    }));
    // Stocker les noms dans data pour affichage/validation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Construire FormData si fichiers présents
      const hasFiles = Object.keys(fileMap).length > 0;
      let payload: any = data;

      if (hasFiles) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
          formData.append(key, val as string);
        });
        Object.entries(fileMap).forEach(([key, files]) => {
          files.forEach(file => formData.append(key, file));
        });
        payload = formData;
      }

      const result = await addElement(`/${entity}`, payload);
      if (result?.data?.success) {
        onSuccess?.(result.data);
        handleClose(false);
      } else {
        console.error("Échec de la sauvegarde :", result);
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
    }
  };

  const handleClose = (val: boolean) => {
    onOpenChange(val);
    reset();
    setFileMap({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto top-[50px] translate-y-0 mt-4"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <FieldSeparator />

        <form onSubmit={handleSubmit} className="py-4">
          <div className="grid grid-cols-12 gap-x-4 gap-y-6">
            {normalizedFields.map((field) => {
              const colClasses = cn(
                colSpanMap[field.colSpan ?? 12],
                field.mdColSpan ? mdColSpanMap[field.mdColSpan] : "",
                field.lgColSpan ? lgColSpanMap[field.lgColSpan] : "",
                field.xlColSpan ? xlColSpanMap[field.xlColSpan] : "",
              );

              return (
                <div
                  key={field.name}
                  className={cn("flex flex-col gap-2 min-w-0", colClasses, field.containerClassName)}
                >
                  {/* Label — masqué pour checkbox et datepicker (qui gère son propre label) */}
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

                  {/* ── Textarea ── */}
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder}
                      value={data[field.name] ?? ""}
                      onChange={(e) => setData(field.name, e.target.value)}
                      disabled={processing}
                      className={field.inputClassName}
                    />

                  /* ── Select ── */
                  ) : field.type === "select" ? (
                    <Select
                      value={data[field.name] ?? ""}
                      onValueChange={(val) => setData(field.name, val)}
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

                  /* ── Checkbox ── */
                  ) : field.type === "checkbox" ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={field.name}
                        checked={!!data[field.name]}
                        onCheckedChange={(checked) => setData(field.name, !!checked)}
                        disabled={processing}
                        className={field.inputClassName}
                      />
                      <Label htmlFor={field.name} className={cn("text-sm cursor-pointer", field.labelClassName)}>
                        {field.label}
                      </Label>
                    </div>

                  /* ── DatePicker ── */
                  ) : field.type === "date" ? (
                    <DatePickerGloabal
                      fieldLabel={field.label}
                      name={field.name}
                      value={data[field.name] ?? ""}
                      onSelect={(date) => setData(field.name, date)}
                    />

                  /* ── File Upload ── */
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
                          onChange={(e) => handleFileChange(field.name, e, field.multiple)}
                        />
                      </label>

                      {/* Liste des fichiers sélectionnés */}
                      {(fileMap[field.name] ?? []).length > 0 && (
                        <ul className="flex flex-col gap-1">
                          {fileMap[field.name].map((file, i) => (
                            <li key={i} className="flex items-center justify-between text-sm px-2 py-1 rounded-md bg-muted">
                              <span className="truncate max-w-[80%]">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(field.name, i)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                  /* ── Input par défaut ── */
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      autoComplete="off"
                      value={data[field.name] ?? ""}
                      onChange={(e) => setData(field.name, e.target.value)}
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
            })}
          </div>

          <DialogFooter className="mt-6">
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