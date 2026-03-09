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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addElement } from "@/hooks/backoffice";
import { FieldSeparator } from "./ui/field";
import * as Icons from "lucide-react";

// ─── Maps statiques pour Tailwind ────────────────────────────────────────────

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
  type?: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  colSpan?: number;
  mdColSpan?: number;
  lgColSpan?: number;
  xlColSpan?: number;
}

interface ModalCreateGenericProps {
  page:any,
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
  page,
  title,
  entity,
  fields,
  onSuccess,
  updateItem,
  isOpen,
  onOpenChange,
}: ModalCreateGenericProps) {

  const PageIcon = page?.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;

  // Normalisation des fields sans muter la prop
  const normalizedFields = React.useMemo<FieldConfig[]>(() => {
    const idField: FieldConfig = {
      name: "id",
      label: "id",
      type: "number",
      placeholder: "id",
      required: false,
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

  // Sync avec updateItem
  React.useEffect(() => {
    if (updateItem != null) {
      setData(
        Object.fromEntries(
          normalizedFields.map(f => [f.name, updateItem?.[f.name] ?? f.defaultValue ?? ""])
        )
      );
    }
  }, [updateItem, normalizedFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addElement(`/${entity}`, data);
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[70vw] md:max-w-[70vw] lg:max-w-[50vw] max-h-[90vh] overflow-y-auto top-[50px] translate-y-0 mt-4"
      >
        <DialogHeader>
          <DialogTitle>
          <div className="flex items-center gap-3 text-[15px]">
            {PageIcon && <PageIcon className="w-4 h-4" />}
            {title}
          </div>
          </DialogTitle>
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
                  {field.type !== "checkbox" && (
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
                      value={data[field.name] ?? ""}
                      onChange={(e) => setData(field.name, e.target.value)}
                      disabled={processing}
                      className={field.inputClassName}
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={data[field.name] ?? ""}
                      onValueChange={(val) => setData(field.name, val)}
                      disabled={processing}
                    >
                      <SelectTrigger className={field.inputClassName}>
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
                        checked={!!data[field.name]}
                        onCheckedChange={(checked) => setData(field.name, !!checked)}
                        disabled={processing}
                        className={field.inputClassName}
                      />
                      <Label htmlFor={field.name} className={cn("text-sm cursor-pointer", field.labelClassName)}>
                        {field.label}
                      </Label>
                    </div>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={processing}
            >
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