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
import { Loader2} from "lucide-react";
import { cn, FieldConfig, ModalCreateGenericProps, TabConfig} from "@/lib/utils";
import { addElement, toCapitalize } from "@/hooks/backoffice";
import { FieldSeparator } from "./ui/field";
import * as Icons from "lucide-react";
import { FieldRenderer, TableTab } from "@/lib/utilsFunctiions";


export function BaseModal({page, title, entity, fields: legacyFields, tabs: tabsProp, onSuccess, updateItem, isOpen, onOpenChange,}: ModalCreateGenericProps)
{
  const PageIcon = page?.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;

  const resolvedTabs = React.useMemo<TabConfig[]>(() =>
  {
    if (tabsProp && tabsProp.length > 0) return tabsProp;
    return [{
      key: "infos",
      label: "Infos Générales",
      fields: legacyFields ?? [],
    }];
  }, [tabsProp, legacyFields]);

  const showTabs = resolvedTabs.length > 1;
  const [activeTab, setActiveTab] = React.useState(resolvedTabs[0]?.key ?? "");

  const flatFields = React.useMemo(() =>
  {
    const allFields: FieldConfig[] = [];
    resolvedTabs.forEach(tab =>
    {
      if (!tab.tableMode)
      {
        tab.fields.forEach(f =>
        {
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


  React.useEffect(() =>
  {
    if (updateItem != null)
    {
      setData(Object.fromEntries(
        flatFields.map(f => [f.name, updateItem?.[f.name] ?? f.defaultValue ?? ""])
      ));
  
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

  const handleChange = (name: string, value: any) =>
  {    
    setData(name, value)
  };

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
                    activeTab === tab.key ? "border-b-3 border-b-primary rounded-b-none" : ""
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