// src/components/CourseCard.tsx
type Course = {
  term: string;
  number: string;
  meets: string;
  title: string;
};

export default function CourseCard({
  course,
  selected = false,
  onToggle,
}: {
  course: Course;
  selected?: boolean;
  onToggle?: () => void;
}) {
  const base =
    'border rounded-xl shadow-sm p-4 h-full flex flex-col justify-between transition-colors cursor-pointer';
  const state = selected
    ? 'bg-indigo-50 border-indigo-400'
    : 'bg-white border-gray-200 hover:bg-gray-50';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle?.()}
      className={`${base} ${state}`}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">
            {course.term} CS {course.number}
          </h3>
          <p className="text-sm text-gray-700">{course.title}</p>
        </div>
        {selected && (
          <span
            className="ml-2 inline-flex items-center justify-center w-6 h-6 text-white bg-indigo-600 rounded-full text-sm"
            aria-label="Selected"
            title="Selected"
          >
            ✓
          </span>
        )}
      </div>

      <div className="mt-4 pt-3 border-t">
        <p className="text-sm text-gray-600">{course.meets}</p>
      </div>
    </div>
  );
}
