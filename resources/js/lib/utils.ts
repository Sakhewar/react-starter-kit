import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface FieldConfig {
  key?: string;
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date" | "file";
  placeholder?: string;
  required?: boolean;
  options?: string;
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
  is_unique?: boolean;
}

export interface TabConfig
{
  key: string;
  label: string;
  icon?: React.ReactNode;
  tableMode?: boolean;
  fields: FieldConfig[];
}

export interface ModalCreateGenericProps
{
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

export interface TableTabProps
{
  tab: TabConfig;
  rows: Record<string, any>[];
  onAddRow: (tabKey: string, row: Record<string, any>) => void;
  onRemoveRow: (tabKey: string, index: number) => void;
  processing?: boolean;
}

export interface FieldRendererProps {
  field: FieldConfig;
  value: any;
  errors?: Record<string, string>;
  processing?: boolean;
  fileMap?: Record<string, File[]>;
  onFileChange?: (name: string, e: React.ChangeEvent<HTMLInputElement>, multiple?: boolean) => void;
  onChange: (name: string, value: any) => void;
  onRemoveFile?: (name: string, index: number) => void;
}

