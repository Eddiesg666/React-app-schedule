// src/components/CourseField.tsx
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CourseFormData } from '../types/courses';

type FieldName = keyof CourseFormData;
type FieldKind = 'input' | 'textarea' | 'select';

export interface CourseFieldProps {
  name: FieldName;
  label: string;
  register: UseFormRegister<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
  placeholder?: string;
  as?: FieldKind;              // "input" (default), "textarea", or "select"
  options?: string[];          // required when as === "select"
  disabled?: boolean;
}

export default function CourseField({
  name,
  label,
  register,
  errors,
  placeholder,
  as = 'input',
  options = [],
  disabled = false,
}: CourseFieldProps) {
  const hasError = !!errors[name];
  const errorMsg = errors[name]?.message as string | undefined;

  const base =
    `w-full rounded border ${hasError ? 'border-red-500' : 'border-gray-300'} 
     bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none`;

  return (
    <label className="block mb-4">
      <p className="text-lg font-medium">
        {label}
        {hasError && (
          <span className="text-sm inline-block pl-2 text-red-500 italic">
            {errorMsg}
          </span>
        )}
      </p>

      {as === 'select' ? (
        <select
          // register supplies name/onChange/onBlur/ref – spread them in
          {...register(name)}
          className={base}
          disabled={disabled}
        >
          {/* Optional blank chooser */}
          <option value="" disabled hidden>
            Select…
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          className={base}
          rows={3}
          disabled={disabled}
        />
      ) : (
        <input
          {...register(name)}
          placeholder={placeholder}
          className={base}
          type="text"
          disabled={disabled}
        />
      )}
    </label>
  );
}
