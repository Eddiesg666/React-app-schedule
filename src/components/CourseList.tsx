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
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 px-4">
      {Object.entries(courses).map(([id, course]) => (
        <CourseCard
          key={id}
          id={id} // ✅ pass the course ID
          course={course}
          selected={selectedCourses.includes(id)}
          disabled={conflicts(id)}
          onToggle={() => onToggle(id)}
        />
      ))}
    </div>
  );
}
