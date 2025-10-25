// src/components/CourseList.tsx
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Record<string, any>;
  selectedCourses: string[];
  onToggle: (id: string) => void;
  conflicts: (id: string) => boolean;
}

export default function CourseList({
  courses,
  selectedCourses,
  onToggle,
  conflicts,
}: CourseListProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(260px,_1fr))] gap-4">
      {Object.entries(courses).map(([id, course]) => {
        const isSelected = selectedCourses.includes(id);
        const isDisabled = !isSelected && conflicts(id);
        return (
          <CourseCard
            key={id}
            id={id}
            course={course}
            selected={isSelected}
            disabled={isDisabled}
            onToggle={() => onToggle(id)}
          />
        );
      })}
    </div>
  );
}
