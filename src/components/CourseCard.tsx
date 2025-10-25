import { Link } from 'react-router-dom';
import { useProfile } from '../utilities/profile';
import type { Course } from '../types/courses';

interface CourseCardProps {
  id?: string;
  course: Course;
  selected?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
}

export default function CourseCard({
  id,
  course,
  selected = false,
  disabled = false,
  onToggle,
}: CourseCardProps) {
  // Make sure we treat any truthy DB value as a boolean
  const [{ isAdmin }] = useProfile();
  const canEdit = !!isAdmin;

  const base =
    'border rounded-xl shadow-sm p-4 h-full flex flex-col justify-between transition-colors';
  const color = selected
    ? 'bg-indigo-50 border-indigo-400'
    : disabled
    ? 'bg-gray-100 border-gray-200 text-gray-400'
    : 'bg-white border-gray-200 hover:bg-gray-50';
  const interactivity = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  const handleClick = () => {
    if (!disabled) onToggle?.();
  };

  return (
    <div
      role={disabled ? undefined : 'button'}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggle?.();
        }
      }}
      className={`${base} ${color} ${interactivity} relative`}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {/* Top row: title/number on left; Edit badge (if admin) absolutely on right */}
      <div className="flex items-start gap-2">
        <div className="flex-1 pr-8">
          <h3 className="text-lg font-semibold mb-1">
            {course.term} CS {course.number}
          </h3>
          <p className="text-sm">{course.title}</p>
        </div>

        {id && canEdit && (
          <Link
            to={`/courses/${id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-white hover:bg-gray-50"
            title="Edit this course"
          >
            ✎ Edit
          </Link>
        )}

        {selected && (
          <span
            className="ml-2 inline-flex items-center justify-center w-6 h-6 text-white bg-indigo-600 rounded-full text-sm"
            title="Selected"
          >
            ✓
          </span>
        )}
        {disabled && !selected && (
          <span
            className="ml-2 inline-flex items-center justify-center w-6 h-6 text-white bg-gray-400 rounded-full text-sm"
            title="Time conflict"
          >
            ×
          </span>
        )}
      </div>

      <div className="mt-4 pt-3 border-t">
        <p className="text-sm">{course.meets || 'TBA'}</p>
      </div>
    </div>
  );
}
