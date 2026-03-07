// components/modals/ModalCreateGeneric.tsx
"use client";

import * as React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils"; // fonction utilitaire shadcn pour merger className

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // pour select
  defaultValue?: any;
  // ClassName personnalisés
  containerClassName?: string;   // autour du champ entier
  labelClassName?: string;       // le label
  inputClassName?: string;       // l'input/select/textarea/checkbox wrapper
  errorClassName?: string;       // le message d'erreur
}

interface ModalCreateGenericProps {
  triggerText?: string;
  title: string;
  description?: string;
  entity: string; // ex: 'pays', 'client' → route `${entity}.store`
  fields: FieldConfig[];
  onSuccess?: (newItem: any) => void;
  children?: React.ReactNode; // custom trigger
}

export function ModalCreateGeneric({
  triggerText = "Ajouter",
  title,
  description,
  entity,
  fields,
  onSuccess,
  children,
}: ModalCreateGenericProps) {
  const [open, setOpen] = React.useState(false);

  const { data, setData, post, processing, errors, reset } = useForm(
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue ?? ""]))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // post(route(`${entity}.store`), {
    //   onSuccess: (page: any) => {
    //     reset();
    //     setOpen(false);
    //     onSuccess?.(page.props.newItem);
    //   },
    //   onError: (err) => {
    //     console.error("Erreur création :", err);
    //   },
    // });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {fields.map((field) => (
            <div key={field.name} className={cn("space-y-2", field.containerClassName)}>
              <Label
                htmlFor={field.name}
                className={cn(field.required && "font-medium", field.labelClassName)}
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={data[field.name]}
                  onChange={(e : any) => setData(field.name, e.target.value)}
                  disabled={processing}
                  className={field.inputClassName}
                />
              ) : field.type === "select" ? (
                <Select
                  value={data[field.name]}
                  onValueChange={(val) => setData(field.name, val)}
                  disabled={processing}
                >
                  <SelectTrigger className={field.inputClassName}>
                    <SelectValue placeholder={field.placeholder || `Choisir ${field.label.toLowerCase()}`} />
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.name}
                    checked={data[field.name]}
                    onCheckedChange={(checked) => setData(field.name, !!checked)}
                    disabled={processing}
                    className={field.inputClassName}
                  />
                  <Label htmlFor={field.name} className="text-sm cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ) : field.type === "date" ? (
                <Input
                  id={field.name}
                  type="date"
                  value={data[field.name]}
                  onChange={(e) => setData(field.name, e.target.value)}
                  disabled={processing}
                  className={field.inputClassName}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={data[field.name]}
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
          ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing}>
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}