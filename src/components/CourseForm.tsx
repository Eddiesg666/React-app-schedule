import type { FormEvent } from 'react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring';
  number: string;
  meets: string;
  title: string;
};
type CoursesById = Record<string, Course>;

export default function CourseForm({ courses }: { courses: CoursesById }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // freeze a snapshot of the course for initial values
  const course = useMemo(() => (id ? courses[id] : undefined), [id, courses]);

  // No submit yet—just prevent default so page doesn’t reload
  const onSubmit = (e: FormEvent) => {
    e.preventDefault(); // keep React state; don’t reload page
    // Intentionally do nothing for now. :contentReference[oaicite:1]{index=1}
  };

  // Controlled inputs (simple one-off without local state since we’re not saving)
  // Using defaultValue lets the fields show existing data while we ignore changes.
  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {course ? `Edit: CS ${course.number}` : 'Edit course'}
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={course?.title ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Course title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="meets">Meets</label>
          <input
            id="meets"
            name="meets"
            type="text"
            defaultValue={course?.meets ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="e.g., MWF 11:00-11:50 or TuTh 14:00-15:20"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          {/* No Submit button per spec */}
        </div>
      </form>
    </main>
  );
}
