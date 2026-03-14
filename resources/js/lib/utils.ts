import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface EntityItem
{
  id: number | string;
  [key: string]: any;
}

export interface PaginatedResponse<T>
{
  data: T[];
  metadata: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface FieldConfig
{
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
  xlGroupCol        ?: number,
  endpoint?         : string;
  createIfEmpty?    : boolean;
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
  palette      : PaletteProps
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


export const PaletteColorsGood = {
  bg      : "#fafafa",
  bgHover : "#f4f4f5",
  bgActive: "#ffffff",

  border: "#e5e5e5",

  text      : "#737373",
  textActive: "#111111",

  accent: "#000000",
}

export type PaletteProps = {
  bg          : string
  bgHover     : string
  bgActive    : string
  border      : string
  text        : string
  textActive  : string
  accent      : string
  accentHover : string
  accentFg    : string
  danger      : string
  dangerHover : string
  dangerFg    : string
  success     : string
  successHover: string
  successFg   : string
  muted       : string
  mutedText   : string
  shadow      : string,
  cardShadow  : string
}


export function PaletteColors(dark = false)
{
  return {
    // ── Backgrounds ───────────────────────────────
    bg        : dark ? "#1c1917" : "#fafaf9",   // fond principal warm
    bgHover   : dark ? "#292524" : "#f5f5f4",   // hover
    bgActive  : dark ? "#211f1c" : "#ffffff",   // cards / surfaces

    // ── Borders ───────────────────────────────────
    border    : dark ? "#3d3a35" : "#e7e5e4",   // bordures warm

    // ── Textes ────────────────────────────────────
    text      : dark ? "#a8a29e" : "#78716c",   // texte secondaire
    textActive: dark ? "#f5f5f4" : "#1c1917",   // texte principal

    // ── Accent (orange cuivré Claude) ─────────────
    accent      : dark ? "#d97757" : "#c2410c", // accent principal
    accentHover : dark ? "#c4623e" : "#9a3412", // accent hover
    accentFg    : "#ffffff",                    // texte sur fond accent

    // ── Danger ────────────────────────────────────
    danger      : "#ef4444",
    dangerHover : "rgba(239,68,68,0.1)",
    dangerFg    : "#ffffff",

    // ── Success ───────────────────────────────────
    success     : "#22c55e",
    successHover: "rgba(34,197,94,0.1)",
    successFg   : "#ffffff",

    // ── Muted ─────────────────────────────────────
    muted    : dark ? "#292524" : "#f5f5f4",    // zones secondaires
    mutedText: dark ? "#57534e" : "#a8a29e",    // texte très atténué

    // ── Shadow ────────────────────────────────────
    shadow: dark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.08)",
    cardShadow: dark ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
    
  }
}