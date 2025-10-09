// src/components/TermPage.tsx
import { useState } from 'react';
import TermSelector, { type Term } from './TermSelector';
import CourseList from './CourseList';
import CoursePlanModal from './CoursePlanModal';

type Course = {
  term: Term;
  number: string;
  meets: string;
  title: string;
};
export type CoursesById = Record<string, Course>;

const toggleList = <T,>(x: T, lst: T[]) =>
  lst.includes(x) ? lst.filter((y) => y !== x) : [...lst, x];

export default function TermPage({ courses }: { courses: CoursesById }) {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [planOpen, setPlanOpen] = useState(false);

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => toggleList(id, prev));

  // Build the items for the modal
  const planItems = selectedIds
    .map((id) => ({ id, course: courses[id] }))
    .filter((x): x is { id: string; course: Course } => Boolean(x.course));

  return (
    <section>
      {/* Toolbar: selector left, plan button right */}
      <div className="flex items-center justify-between mb-4">
        <TermSelector selected={selectedTerm} setSelected={setSelectedTerm} />
        <button
          className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
          onClick={() => setPlanOpen(true)}
        >
          Course plan
        </button>
      </div>

      {/* (Optional) inline summary can be removed now if you like */}
      {/* <div className="mb-4 text-sm text-gray-600">
        {selectedIds.length} selected
      </div> */}

      <CourseList
        courses={courses}
        selectedTerm={selectedTerm}
        selectedIds={selectedIds}
        toggleSelected={toggleSelected}
      />

      <CoursePlanModal
        isOpen={planOpen}
        onClose={() => setPlanOpen(false)}
        items={planItems}
      />
    </section>
  );
}
