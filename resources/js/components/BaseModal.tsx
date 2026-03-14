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
import { Loader2 } from "lucide-react";
import { cn, FieldConfig, ModalCreateGenericProps, TabConfig } from "@/lib/utils";
import { addElement, toCapitalize, useGlobalStore } from "@/hooks/backoffice";
import { FieldSeparator } from "./ui/field";
import * as Icons from "lucide-react";
import { FieldRenderer, groupFields, TableTab } from "@/lib/utilsFunctiions";

  // ─── ColSpan maps (statiques — hors composant) ────────

const colSpanMap: Record<number, string> = {
  1 : "col-span-1",  2 : "col-span-2",  3 : "col-span-3",
  4 : "col-span-4",  5 : "col-span-5",  6 : "col-span-6",
  7 : "col-span-7",  8 : "col-span-8",  9 : "col-span-9",
  10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
}

const mdColSpanMap: Record<number, string> = {
  1 : "md:col-span-1",  2 : "md:col-span-2",  3 : "md:col-span-3",
  4 : "md:col-span-4",  5 : "md:col-span-5",  6 : "md:col-span-6",
  7 : "md:col-span-7",  8 : "md:col-span-8",  9 : "md:col-span-9",
  10: "md:col-span-10", 11: "md:col-span-11", 12: "md:col-span-12",
}

const lgColSpanMap: Record<number, string> = {
  1 : "lg:col-span-1",  2 : "lg:col-span-2",  3 : "lg:col-span-3",
  4 : "lg:col-span-4",  5 : "lg:col-span-5",  6 : "lg:col-span-6",
  7 : "lg:col-span-7",  8 : "lg:col-span-8",  9 : "lg:col-span-9",
  10: "lg:col-span-10", 11: "lg:col-span-11", 12: "lg:col-span-12",
}

const xlColSpanMap: Record<number, string> = {
  1 : "xl:col-span-1",  2 : "xl:col-span-2",  3 : "xl:col-span-3",
  4 : "xl:col-span-4",  5 : "xl:col-span-5",  6 : "xl:col-span-6",
  7 : "xl:col-span-7",  8 : "xl:col-span-8",  9 : "xl:col-span-9",
  10: "xl:col-span-10", 11: "xl:col-span-11", 12: "xl:col-span-12",
}

  // ─── Composant ────────────────────────────────────────

export function BaseModal({
  page,
  title,
  entity,
  fields: legacyFields,
  tabs  : tabsProp,
  onSuccess,
  updateItem,
  isOpen,
  onOpenChange,
  palette
}: ModalCreateGenericProps) {
  const PageIcon = page?.icon
    ? (Icons[page.icon as keyof typeof Icons] as React.ElementType)
    :  null

    // ─── Tabs ─────────────────────────────────────────

  const resolvedTabs = React.useMemo<TabConfig[]>(() => {
    if (tabsProp && tabsProp.length > 0) return tabsProp
    return [{
      key   : "infos",
      label : "Infos Générales",
      fields: legacyFields ?? [],
    }]
  }, [tabsProp, legacyFields])

  const showTabs                  = resolvedTabs.length > 1
  const [activeTab, setActiveTab] = React.useState(resolvedTabs[0]?.key ?? "")

    // ─── Flat fields pour useForm ─────────────────────

  const flatFields = React.useMemo(() => {
    const allFields: FieldConfig[] = []
    resolvedTabs.forEach((tab) => {
      if (!tab.tableMode && Array.isArray(tab.fields)) {
        tab.fields.forEach((f) => {
          if (!allFields.some((existing) => existing.name === f.name)) {
            allFields.push(f)
          }
        })
      }
    })
    if (!allFields.some((f) => f.name === "id")) {
      allFields.unshift({
        name              : "id",
        label             : "id",
        type              : "number",
        defaultValue      : "",
        containerClassName: "hidden",
      })
    }
    return allFields
  }, [resolvedTabs])

  const { data, setData, processing, errors, reset } = useForm(
    Object.fromEntries(flatFields.map((f) => [f.name, f.defaultValue ?? ""]))
  )

  const [fileMap, setFileMap]     = React.useState<Record<string, File[]>>({})
  const [tableRows, setTableRows] = React.useState<Record<string, Record<string, any>[]>>({})

    // ─── Effects ──────────────────────────────────────

  React.useEffect(() => {
    if (updateItem == null) return

    let newData = Object.fromEntries(
      flatFields.map((f) => [f.name, updateItem?.[f.name] ?? f.defaultValue ?? ""])
    )

    resolvedTabs.forEach((tab) => {
      if (Array.isArray(updateItem[tab.key])) {
        if (tab.tableMode && Array.isArray(tab.fields)) {
          setTableRows((prev) => ({ ...prev, [tab.key]: updateItem[tab.key] }))
        } else {
          newData = { ...newData, [tab.key]: updateItem[tab.key] }
        }
      }
    })

    setData(newData)
  }, [updateItem, flatFields, resolvedTabs])

  React.useEffect(() => {
    if (isOpen) setActiveTab(resolvedTabs[0]?.key ?? "")
  }, [isOpen, resolvedTabs])

    // ─── Handlers ─────────────────────────────────────

  const closeModal = React.useCallback(() => {
    onOpenChange(false)
    reset()
    setFileMap({})
    setTableRows({})
    setActiveTab(resolvedTabs[0]?.key ?? "")
  }, [onOpenChange, reset, resolvedTabs])

  const handleChange = React.useCallback((name: string, value: any) => {
    setData(name, value)
  }, [setData])

  const handleFileChange = React.useCallback((
    fieldName : string,
    e         : React.ChangeEvent<HTMLInputElement>,
    multiple ?: boolean
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const fileArray = Array.from(files)
    setFileMap((prev) => ({
      ...prev,
      [fieldName]: multiple ? [...(prev[fieldName] ?? []), ...fileArray]: fileArray,
    }))
    setData(fieldName, fileArray.map((f) => f.name).join(", "))
  }, [setData])

  const handleRemoveFile = React.useCallback((fieldName: string, index: number) => {
    setFileMap((prev) => {
      const updated = [...(prev[fieldName] ?? [])]
      updated.splice(index, 1)
      return { ...prev, [fieldName]: updated }
    })
    setData(fieldName, "")
  }, [setData])

  const handleAddRow = React.useCallback((tabKey: string, row: Record<string, any>) => {
    setTableRows((prev) => ({
      ...prev,
      [tabKey]: [...(prev[tabKey] ?? []), row],
    }))
  }, [])

  const handleRemoveRow = React.useCallback((tabKey: string, index: number) => {
    setTableRows((prev) => {
      const updated = [...(prev[tabKey] ?? [])]
      updated.splice(index, 1)
      return { ...prev, [tabKey]: updated }
    })
  }, [])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let payload: any = { ...data }

      Object.entries(tableRows).forEach(([key, rows]) => {
        payload[key] = rows
      })

      const hasFiles = Object.keys(fileMap).length > 0
      if (hasFiles) {
        const formData = new FormData()
        Object.entries(payload).forEach(([key, val]) => {
          formData.append(key, Array.isArray(val) ? JSON.stringify(val) : val as string)
        })
        Object.entries(fileMap).forEach(([key, files]) => {
          files.forEach((file) => formData.append(key, file))
        })
        payload = formData
      }

      const result = await addElement(`/${entity}`, payload)
      if (result?.data?.success) {
        onSuccess?.(result.data)
        closeModal()
      } else {
        console.error("Échec de la sauvegarde :", result)
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err)
    }
  }, [data, tableRows, fileMap, entity, onSuccess, closeModal])

    // ─── JSX ──────────────────────────────────────────

  return (
    <Dialog open = {isOpen} onOpenChange = {closeModal}>
      <DialogContent
        aria-describedby  = {undefined}
        onOpenAutoFocus   = {(e) => e.preventDefault()}
        onInteractOutside = {(e) => e.preventDefault()}
        className         = "sm:max-w-[60vw] max-h-[90vh] overflow-y-auto top-[50px] translate-y-0 mt-4 [&>button:last-of-type]:hidden"
        style             = {{
          background: palette?.bgActive,
          border    : `1px solid ${palette?.border}`,
        }}
      >
        {/* ── Header ── */}
        <DialogHeader className = "flex flex-row items-center justify-between gap-4 pb-0">
          <DialogTitle
            className = "shrink-0 flex items-center gap-2 text-sm font-semibold"
            style     = {{ color: palette?.textActive }}
          >
            {PageIcon && (
              <PageIcon className = "w-4 h-4" style = {{ color: palette?.accent }} />
            )}
            {toCapitalize(title)}
          </DialogTitle>

          {showTabs && (
            <div className = "flex items-center gap-1">
              {resolvedTabs.map((tab) => (
                <button
                  key       = {tab.key}
                  type      = "button"
                  onClick   = {() => setActiveTab(tab.key)}
                  className = {cn(
                    "flex items-center gap-1.5 h-8 px-3 text-xs font-medium cursor-pointer rounded-md transition-all",
                    activeTab === tab.key
                      ? "border-b-2 rounded-b-none"
                      :  "opacity-60 hover:opacity-100"
                  )}
                  style={{
                    color       : activeTab === tab.key ? palette?.textActive : palette?.text,
                    borderColor: activeTab  === tab.key ? palette?.accent     : "transparent",
                    background  : activeTab === tab.key ? `${palette?.accent}15` : "transparent",
                  }}
                >
                  {tab.icon && (
                    <span className = "[&>svg]:h-3.5 [&>svg]:w-3.5">{tab.icon}</span>
                  )}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </DialogHeader>

        <FieldSeparator />

        {/* ── Form ── */}
        <form onSubmit = {handleSubmit} className = "py-2">
          {resolvedTabs.map((tab) => (
            <div
              key       = {tab.key}
              className = {cn(tab.key !== activeTab && "hidden")}
            >
              {tab.tableMode ? (
                Array.isArray(tab.fields) ? (
                  <TableTab
                    tab         = {tab}
                    rows        = {tableRows[tab.key] ?? []}
                    onAddRow    = {handleAddRow}
                    onRemoveRow = {handleRemoveRow}
                    processing  = {processing}
                  />
                ) : (
                  tab.fields(data, setData)
                )
              ) : (
                <div className = "grid grid-cols-12 gap-x-4 gap-y-6">
                  {Array.isArray(tab.fields)
                    ? groupFields(tab.fields).map((group, i) =>
                        group.kind === "grouped" ? (
                          <div
                            key       = {i}
                            className = {cn(
                              colSpanMap[group.groupCol],
                              group.mdGroupCol ? mdColSpanMap[group.mdGroupCol]: "",
                              group.lgGroupCol ? lgColSpanMap[group.lgGroupCol]: "",
                              group.xlGroupCol ? xlColSpanMap[group.xlGroupCol]: "",
                              "flex flex-col gap-4"
                            )}
                          >
                            {group.fields.map((field) => (
                              <FieldRenderer
                                key          = {field.name}
                                field        = {field}
                                value        = {data[field.name]}
                                onChange     = {handleChange}
                                errors       = {errors}
                                processing   = {processing}
                                fileMap      = {fileMap}
                                onFileChange = {handleFileChange}
                                onRemoveFile = {handleRemoveFile}
                              />
                            ))}
                          </div>
                        ) : (
                          <FieldRenderer
                            key          = {group.field.name}
                            field        = {group.field}
                            value        = {data[group.field.name]}
                            onChange     = {handleChange}
                            errors       = {errors}
                            processing   = {processing}
                            fileMap      = {fileMap}
                            onFileChange = {handleFileChange}
                            onRemoveFile = {handleRemoveFile}
                          />
                        )
                      )
                    : tab.fields(data, setData)}
                </div>
              )}
            </div>
          ))}

          {/* ── Footer ── */}
          <DialogFooter className = "mt-8">
            <button
              type      = "button"
              onClick   = {closeModal}
              disabled  = {processing}
              className = "h-9 px-4 text-xs rounded-md transition-all"
              style     = {{
                color     : palette?.text,
                border    : `1px solid ${palette?.border}`,
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = palette?.bgHover ?? ""
                e.currentTarget.style.color      = palette?.textActive ?? ""
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color      = palette?.text ?? ""
              }}
            >
              Annuler
            </button>

            <button
              type      = "submit"
              disabled  = {processing}
              className = "h-9 px-4 text-xs rounded-md transition-all flex items-center gap-2"
              style     = {{
                background: palette?.accent,
                color     : "#fff",
                opacity   : processing ? 0.7: 1,
              }}
            >
              {processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Valider
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}