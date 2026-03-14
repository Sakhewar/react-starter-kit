import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface FieldConfig {
  key               ?: string;
  name               : string;
  label              : string;
  type              ?: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date" | "file" | "radio-group";
  placeholder       ?: string;
  required          ?: boolean;
  options           ?: string;
  defaultValue      ?: any;
  accept            ?: string;
  multiple          ?: boolean;
  containerClassName?: string;
  labelClassName    ?: string;
  inputClassName    ?: string;
  errorClassName    ?: string;
  colSpan           ?: number;
  mdColSpan         ?: number;
  lgColSpan         ?: number;
  xlColSpan         ?: number;
  tableMode         ?: boolean;
  fields            ?: FieldConfig[];
  is_unique         ?: boolean;
  radioOptions      ?: RadioOption[];
  radioStyle        ?: "pill" | "box" | "minimal";
  activeClassName   ?: string;                                                                                              // défaut actif pour toutes les options
  inactiveClassName ?: string;
  group             ?: "left" | "right";
  groupCol          ?: number;
  nbRowsTextArea?    : number,
  mdGroupCol        ?: number,
  lgGroupCol        ?: number,
  xlGroupCol        ?: number
}

export type FieldGroup = 
  | { kind: "grouped"; groupCol: number; mdGroupCol?: number; lgGroupCol?: number; xlGroupCol?: number; fields: FieldConfig[] }
  | { kind: "solo";    field: FieldConfig };

export interface RadioOption
{
    label                : string;
    value                : string | number | boolean | null;
    activeClassName     ?: string;
    radioActiveClassName?: string;
    labelClassName      ?: string;
    icon                ?: React.ReactNode;
}

export interface RadioGroupFieldProps {
  name              : string;
  value             : string | number | null;
  onChange          : (name: string, value: string | number | null | boolean) => void;
  radioOptions      : RadioOption[];
  radioStyle       ?: "pill" | "box" | "minimal";
  activeClassName  ?: string;
  inactiveClassName?: string;
  disabled         ?: boolean;
  label            ?: string;
  labelClassName   ?: string;
  required         ?: boolean;
}

export interface TabConfig
{
  key       : string;
  label     : string;
  icon     ?: React.ReactNode;
  tableMode?: boolean;
  fields    : FieldConfig[] |  ((data: Record<string, any>, setData: (data: Record<string, any>) => void) => React.ReactNode);
}

export interface ModalCreateGenericProps
{
  page        ?: any;
  title        : string;
  description ?: string;
  entity       : string;
  fields      ?: FieldConfig[];
  tabs        ?: TabConfig[];
  onSuccess   ?: (newItem: any) => void;
  updateItem  ?: any;
  isOpen       : boolean;
  onOpenChange : (open: boolean) => void;
}

export interface TableTabProps
{
  tab         : TabConfig;
  rows        : Record<string, any>[];
  onAddRow    : (tabKey: string, row: Record<string, any>) => void;
  onRemoveRow : (tabKey: string, index: number) => void;
  processing ?: boolean;
}

export interface FieldRendererProps {
  field        : FieldConfig;
  value        : any;
  errors      ?: Record<string, string>;
  processing  ?: boolean;
  fileMap     ?: Record<string, File[]>;
  onFileChange?: (name: string, e: React.ChangeEvent<HTMLInputElement>, multiple?: boolean) => void;
  onChange     : (name: string, value: any) => void;
  onRemoveFile?: (name: string, index: number) => void;
}

export type Action = 
{
  key       : string;
  label     : string;
  icon     ?: React.ComponentType<{ className?: string }> | React.ReactElement;
  variant  ?: "default" | "destructive" | "primary" | "secondary" | "success";
  condition?: (row: any) => boolean;
  onClick  ?: (row: any) => void;
};

export type ActionsConfig = 
{
  edit         ?: boolean | ((row: any) => boolean);
  clone        ?: boolean | ((row: any) => boolean);
  delete       ?: boolean | ((row: any) => boolean);
  [key: string] : boolean | ((row: any) => boolean) | undefined;
};

export type Column = {
  key          : string;
  label        : string;
  className   ?: string;
  sortable    ?: boolean;
  render      ?: (value: any, row: any, extra?: { namepage: string; attributeName: string }) => React.ReactNode;
  actionConfig?: ActionsConfig | (() => ActionsConfig);
  extraActions?: Action[];
};

export const PaletteColors1 = {
  // bg        : "#0f1117",
  // bgHover   : "#161b27",
  // bgActive  : "#1a2035",
  // border    : "#1e2130",
  // text      : "#94a3b8",
  // textActive: "#e2e8f0",
  // accent    : "#3b82f6",

  bg        : "#ffffff",
  bgHover   : "#f8fafc",
  bgActive  : "#f1f5f9",
  border    : "#e2e8f0",
  text      : "#0f172a",
  textActive: "#020617",
  accent    : "#3b82f6",
}

export const PaletteColors = {
  bg        : "#ffffff",
  bgHover   : "#f8fafc",
  bgActive  : "#f1f5f9",

  card      : "#ffffff",
  border    : "#e6e8ec",

  text      : "#6b7280",
  textActive: "#111827",

  accent    : "#0f172a",
}
