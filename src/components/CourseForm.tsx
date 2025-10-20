// src/components/CourseForm.tsx
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler, type SubmitErrorHandler } from 'react-hook-form';
import CourseField from './CourseField';
import { courseResolver, type CourseFormData, TermEnum } from '../types/courses';
import { updateAt } from '../utilities/firebase';

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
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isValid, dirtyFields, isDirty },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: course?.title ?? '',
      term: (course?.term as CourseFormData['term']) ?? 'Fall',
      number: course?.number ?? '',
      meets: course?.meets ?? '',
    },
    resolver: courseResolver,
    mode: 'onChange',
  });

const onSubmit: SubmitHandler<CourseFormData> = async (_data) => {
  if (!isDirty) return;
  if (!id) return;

  const dirtyKeys = Object.keys(dirtyFields) as (keyof CourseFormData)[];
  const patch = Object.fromEntries(
    dirtyKeys.map((k) => [k, getValues(k)])
  ) as Partial<CourseFormData>;

  if (Object.keys(patch).length === 0) return;

  try {
    await updateAt(`/courses/${id}`, patch); // or `/schedule/courses/${id}` if that’s your structure
    navigate(-1);
  } catch (err) {
    console.error('Update failed:', err);
    alert('Saving failed. Please try again.');
  }
};


  const onError: SubmitErrorHandler<CourseFormData> = () => {
    // Optional: surface a toast, but inline field errors already show why
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {course ? `Edit: CS ${course.number}` : 'Edit course'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
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

          <button
            type="submit"
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            disabled={isSubmitting || !isValid || !isDirty}
            title={
              !isValid ? 'Fix form errors first' : !isDirty ? 'No changes made' : 'Save changes'
            }
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
