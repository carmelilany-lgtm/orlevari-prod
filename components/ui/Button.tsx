import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  asChild?: false;
}

interface AnchorButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  variant?: ButtonVariant;
  children: ReactNode;
  href: string;
  asChild: true;
}

type Props = ButtonProps | AnchorButtonProps;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40 border border-blue-400/20 hover:shadow-blue-500/30",
  secondary:
    "border border-blue-500/30 bg-blue-950/40 text-slate-100 hover:border-cyan-400/50 hover:bg-blue-900/50",
  ghost: "text-slate-300 hover:bg-blue-950/50 hover:text-white",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:pointer-events-none disabled:opacity-50";

export function Button(props: Props) {
  const variant = props.variant ?? "primary";
  const className = cn(base, variants[variant], props.className);

  if ("asChild" in props && props.asChild) {
    const { asChild: _, variant: __, children, ...rest } = props;
    return (
      <a className={className} {...rest}>
        {children}
      </a>
    );
  }

  const { children, type = "button", ...rest } = props as ButtonProps;
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
}
