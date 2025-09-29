// src/components/CourseList.tsx
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
    <div>
      {Object.entries(courses).map(([id, c]) => (
        <div key={id}>
          {c.term} CS {c.number}: {c.title}
        </div>
      ))}
    </div>
  );
}
