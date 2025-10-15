import type { CourseFormData } from '../types/courses';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

interface CourseFieldProps {
  name: keyof CourseFormData;
  label: string;
  register: UseFormRegister<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
  type?: string;
  placeholder?: string;
  as?: 'input' | 'select' | 'textarea';
  options?: string[]; // for select
}

export default function CourseField({
  name,
  label,
  register,
  errors,
  type = 'text',
  placeholder,
  as = 'input',
  options = [],
}: CourseFieldProps) {
  const err = errors[name]?.message as string | undefined;

  return (
    <label className="block">
      <p className="text-sm font-medium">
        {label}
        {err && (
          <span className="text-xs text-red-500 italic pl-2">{err}</span>
        )}
      </p>

      {as === 'select' ? (
        <select
          {...register(name)}
          className={`mt-1 w-full rounded-md border ${
            err ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 bg-white`}
        >
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
          className={`mt-1 w-full rounded-md border ${
            err ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
          rows={3}
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className={`mt-1 w-full rounded-md border ${
            err ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
        />
      )}
    </label>
  );
}
