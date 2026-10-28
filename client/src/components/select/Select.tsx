
import { useId, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  options: readonly SelectOption[];
  placeholder?: string;
};

const Select = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = "",
  id,
  ...selectProps
}: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;
  const message = error ?? helperText;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-slate-600"
        >
          {label}
        </label>
      )}

      <select
        {...selectProps}
        id={selectId}
        aria-invalid={error ? true : selectProps["aria-invalid"]}
        aria-describedby={
          message
            ? [selectProps["aria-describedby"], messageId]
                .filter(Boolean)
                .join(" ")
            : selectProps["aria-describedby"]
        }
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/15"
            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/15"
        } ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(({ label: optionLabel, value, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {optionLabel}
          </option>
        ))}
      </select>

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

export default Select;
