// src/components/CourseList.tsx
import CourseCard from './CourseCard';
import type { Term } from './TermSelector';

type Course = {
  term: Term;
  number: string;
  meets: string;
  title: string;
};

type CourseListProps = {
  courses: Record<string, Course>;
  selectedTerm: Term;
  selectedIds: string[];
  toggleSelected: (id: string) => void;
};

export default function CourseList({
  courses,
  selectedTerm,
  selectedIds,
  toggleSelected,
}: CourseListProps) {
  const entries = Object.entries(courses)
    .filter(([_, c]) => c.term === selectedTerm)
    .sort(([, a], [, b]) => a.number.localeCompare(b.number));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {entries.map(([id, c]) => (
        <CourseCard
          key={id}
          course={c}
          selected={selectedIds.includes(id)}
          onToggle={() => toggleSelected(id)}
        />
      ))}
    </div>
  );
}
