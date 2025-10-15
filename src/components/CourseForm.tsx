import type { FormEvent } from 'react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CourseField from './CourseField';
import {
  courseResolver,
  type CourseFormData,
  TermEnum,
} from '../types/courses';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring' | 'Summer';
  number: string;
  meets: string;
  title: string;
};
type CoursesById = Record<string, Course>;

export default function CourseForm({ courses }: { courses: CoursesById }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = useMemo(() => (id ? courses[id] : undefined), [id, courses]);

  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: course?.title ?? '',
      term: course?.term ?? 'Fall',
      number: course?.number ?? '',
      meets: course?.meets ?? '',
    },
    resolver: courseResolver,
    mode: 'onChange', // validate as the user types/changes
  });

  // Per task: form has onSubmit but does nothing (no Save yet)
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {course ? `Edit: CS ${course.number}` : 'Edit course'}
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <CourseField
          name="title"
          label="Title"
          register={register}
          errors={errors}
          placeholder='e.g., "Algorithms"'
        />

        <CourseField
          name="term"
          label="Term"
          register={register}
          errors={errors}
          as="select"
          options={TermEnum.options} // ["Fall","Winter","Spring","Summer"]
        />

        <CourseField
          name="number"
          label="Course number"
          register={register}
          errors={errors}
          placeholder='e.g., "213" or "213-2"'
        />

        <CourseField
          name="meets"
          label="Meets"
          register={register}
          errors={errors}
          placeholder='e.g., "MWF 12:00-13:20" or empty'
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          {/* No Submit button per spec */}
        </div>
      </form>
    </main>
  );
}
