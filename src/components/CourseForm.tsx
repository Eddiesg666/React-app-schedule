// src/components/CourseForm.tsx
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import { ref, update } from 'firebase/database';

import CourseField from './CourseField';
import { database } from '../utilities/firebase';
import { courseResolver, TermEnum, type CourseFormData, type CoursesById } from '../types/courses';

export default function CourseForm({ courses }: { courses: CoursesById }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const course = useMemo(() => (id ? courses[id] : undefined), [courses, id]);

  // Fallback if no course found
  if (!id || !course) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <h1 className="text-xl font-semibold">Course not found</h1>
      </div>
    );
  }

  const defaultValues: CourseFormData = {
    title: course.title,
    term: course.term,
    number: course.number,
    meets: course.meets ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CourseFormData>({
    defaultValues,
    mode: 'onChange',
    resolver: courseResolver,
  });

  const termOptions = TermEnum.options; // ["Fall","Winter","Spring","Summer"]

  const onSubmit: SubmitHandler<CourseFormData> = async (data) => {
    // No network call if nothing changed or still submitting
    if (!isDirty || isSubmitting) return;

    // Persist updates to /courses/<id>
    await update(ref(database, `courses/${id}`), data);

    // Back to list
    navigate('/');
  };

  const onError: SubmitErrorHandler<CourseFormData> = () => {
    // Let the inline field messages guide the user
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="max-w-[720px]">
      {/* Hidden ID field not required; we use the URL param */}
      <CourseField
        name="title"
        label="Title"
        register={register}
        errors={errors}
        placeholder="e.g., Fundamentals of Computer Programming I"
      />

      <CourseField
        name="term"
        label="Term"
        register={register}
        errors={errors}
        as="select"
        options={termOptions}
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
        placeholder='e.g., "MWF 12:00-13:20" or blank'
        as="textarea"
      />

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="px-4 py-2 rounded border shadow-sm bg-black text-white disabled:opacity-40"
        >
          {isSubmitting ? 'Saving…' : 'Submit'}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded border shadow-sm bg-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
