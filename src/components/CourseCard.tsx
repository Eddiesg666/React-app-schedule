import { Link } from 'react-router-dom';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring';
  number: string;
  meets: string;
  title: string;
};

export default function CourseCard({
  id,
  course,
  selected = false,
  disabled = false,
  onToggle,
}: {
  id?: string;
  course: Course;
  selected?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
}) {
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
      onKeyDown={(e) =>
        !disabled && (e.key === 'Enter' || e.key === ' ') && onToggle?.()
      }
      className={`${base} ${color} ${interactivity} relative`}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">
            {course.term} CS {course.number}
          </h3>
          <p className="text-sm">{course.title}</p>
        </div>

        {/* ✅ Edit link — stops click from toggling selection */}
        {id && (
          <Link
            to={`/courses/${id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="ml-2 text-xs underline text-blue-700 hover:text-blue-900"
            title="Edit this course"
          >
            Edit
          </Link>
        )}

        {/* ✅ Status badges */}
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
