import { useId, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

const Input = ({
  label,
  error,
  helperText,
  className = "",
  id,
  ...inputProps
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? helperText;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm lg:text-md font-medium text-slate-600"
        >
          {label}
        </label>
      )}

      <input
        {...inputProps}
        id={inputId}
        aria-invalid={error ? true : inputProps["aria-invalid"]}
        aria-describedby={
          message ? [inputProps["aria-describedby"], messageId].filter(Boolean).join(" ") : inputProps["aria-describedby"]
        }
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/15"
            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/15"
        } ${className}`}
      />

      {message && (
        <p
          id={messageId}
          className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-slate-500"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Input;
