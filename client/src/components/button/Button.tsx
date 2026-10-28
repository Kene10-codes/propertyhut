import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus-visible:ring-emerald-600",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-500",
  danger:
    "bg-red-600 text-white shadow-md shadow-red-600/20 hover:bg-red-700 focus-visible:ring-red-600",
};

const Button = ({
  variant = "primary",
  type = "button",
  className = "",
  children,
  ...buttonProps
}: ButtonProps) => {
  return (
    <button
      {...buttonProps}
      type={type}
      className={`inline-flex items-center cursor-pointer justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
