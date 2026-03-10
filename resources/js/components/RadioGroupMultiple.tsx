

import { cn, RadioGroupFieldProps } from "@/lib/utils";


const STYLE_DEFAULTS = {
  pill: {
    wrapper: "flex flex-wrap gap-2",
    base: "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer select-none",
    active: "bg-primary text-primary-foreground border-primary shadow-sm",
    inactive: "bg-background text-muted-foreground border-input hover:border-primary hover:text-primary",
  },
  box: {
    wrapper: "flex flex-wrap gap-2",
    base: "px-4 py-2 rounded-md text-sm font-medium border transition-all duration-150 cursor-pointer select-none",
    active: "bg-primary text-primary-foreground border-primary shadow-sm",
    inactive: "bg-background text-muted-foreground border-input hover:border-primary hover:text-primary",
  },
  minimal: {
    wrapper: "flex flex-wrap gap-4",
    base: "flex items-center gap-2 text-sm cursor-pointer select-none",
    active: "text-primary font-semibold",
    inactive: "text-muted-foreground hover:text-foreground",
  },
};
  
export function RadioGroupField({
  name,
  value,
  onChange,
  radioOptions,
  radioStyle = "pill",
  activeClassName,
  inactiveClassName,
  disabled = false,
  label,
  labelClassName,
  required,
}: RadioGroupFieldProps) {
  const styles = STYLE_DEFAULTS[radioStyle];

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span
          className={cn(
            "text-sm font-medium",
            required && "after:content-['*'] after:text-red-500 after:ml-1",
            labelClassName
          )}
        >
          {label}
        </span>
      )}

      <div className={styles.wrapper} role="radiogroup">
        {radioOptions.map((option) => {
          const isActive = value === option.value;
          const isMinimal = radioStyle === "minimal";

          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(name, isActive ? null : option.value)}
              className={cn(
                styles.base,
                isActive
                  ? (option.activeClassName ?? activeClassName ?? styles.active)
                  : (inactiveClassName ?? styles.inactive),
                disabled && "opacity-50 pointer-events-none"
              )}
            >
              {isMinimal && (
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    isActive ? "border-primary" : "border-muted-foreground"
                  )}
                >
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-primary block" />
                  )}
                </span>
              )}
              {option.icon && <span className="shrink-0">{option.icon}</span>}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
  
  
