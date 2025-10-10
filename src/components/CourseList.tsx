// src/components/CourseList.tsx
import CourseCard from './CourseCard';
import type { Term } from './TermSelector';
import { conflictsWithAny } from '../utilities/conflicts';

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
  // Build the selected courses array (objects) for conflict checks
  const selectedCourses = selectedIds
    .map((id) => courses[id])
    .filter((c): c is Course => Boolean(c));

  const entries = Object.entries(courses)
    .filter(([_, c]) => c.term === selectedTerm)
    .sort(([, a], [, b]) => a.number.localeCompare(b.number));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {entries.map(([id, c]) => {
        const isSelected = selectedIds.includes(id);

        // Only disable if NOT already selected, and conflicts with any selected course
        const isDisabled =
          !isSelected && conflictsWithAny(c, selectedCourses);

        return (
          <CourseCard
            key={id}
            course={c}
            selected={isSelected}
            disabled={isDisabled}
            onToggle={() => toggleSelected(id)}
          />
        );
      })}
    </div>
  );
}
