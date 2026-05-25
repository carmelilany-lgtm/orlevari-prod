import { adminInputClass, adminLabelClass } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  label: string;
  name?: string;
  error?: string;
  hint?: string;
  children?: ReactNode;
  className?: string;
} & (
  | {
      as?: "input";
      type?: string;
      value: string | number;
      onChange: (value: string) => void;
      placeholder?: string;
      required?: boolean;
      min?: number;
    }
  | {
      as: "textarea";
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      required?: boolean;
      rows?: number;
    }
  | {
      as: "select";
      value: string;
      onChange: (value: string) => void;
      options: { value: string; label: string }[];
      required?: boolean;
    }
  | {
      as: "custom";
      children: ReactNode;
    }
);

export function AdminFormField(props: Props) {
  const { label, error, hint, className } = props;

  let control: ReactNode;

  if (props.as === "custom" || ("children" in props && props.children && !props.as)) {
    control = props.as === "custom" ? props.children : props.children;
  } else if (props.as === "textarea") {
    control = (
      <textarea
        id={props.name}
        name={props.name}
        rows={props.rows ?? 4}
        className={cn(adminInputClass, "resize-y")}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
      />
    );
  } else if (props.as === "select") {
    control = (
      <select
        id={props.name}
        name={props.name}
        className={adminInputClass}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
      >
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  } else {
    control = (
      <input
        id={props.name}
        name={props.name}
        type={props.type ?? "text"}
        className={adminInputClass}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
        min={props.min}
      />
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={props.name} className={adminLabelClass}>
        {label}
      </label>
      {control}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
    </div>
  );
}
