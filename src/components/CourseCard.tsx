// src/components/CourseCard.tsx
type Course = {
  term: string;
  number: string;
  meets: string;
  title: string;
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="border rounded-xl shadow-sm p-4 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {course.term} CS {course.number}
        </h3>
        <p className="text-sm text-gray-700">{course.title}</p>
      </div>
      <div className="mt-4 pt-3 border-t">
        <p className="text-sm text-gray-600">{course.meets}</p>
      </div>
    </div>
  );
}
