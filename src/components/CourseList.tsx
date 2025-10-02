// src/components/CourseList.tsx
import CourseCard from './CourseCard';

type Course = {
  term: string;
  number: string;
  meets: string;
  title: string;
};

type CourseListProps = {
  courses: Record<string, Course>;
};

export default function CourseList({ courses }: CourseListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(courses).map(([id, c]) => (
        <CourseCard key={id} course={c} />
      ))}
    </div>
  );
}
