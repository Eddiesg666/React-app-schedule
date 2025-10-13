import { useState } from 'react';
import TermSelector, { type Term } from './TermSelector';
import CourseList from './CourseList';
import CoursePlanModal from './CoursePlanModal';
import { conflictsWithAny } from '../utilities/conflicts';

type Course = {
  term: Term;
  number: string;
  meets: string;
  title: string;
};
type CoursesById = Record<string, Course>;

// helper: immutable toggle
const toggleList = <T,>(x: T, lst: T[]) =>
  lst.includes(x) ? lst.filter((y) => y !== x) : [...lst, x];

export default function TermPage({ courses }: { courses: CoursesById }) {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [planOpen, setPlanOpen] = useState(false);

  const selectedCoursesObjs = selectedIds
    .map((id) => courses[id])
    .filter((c): c is Course => Boolean(c));

  const onToggle = (id: string) => setSelectedIds((prev) => toggleList(id, prev));

  // This matches your CourseList prop: (id) => boolean
  const conflicts = (id: string): boolean => {
    // never disable a card that is already selected (must be unselectable)
    if (selectedIds.includes(id)) return false;
    const c = courses[id];
    if (!c) return false;
    return conflictsWithAny(c, selectedCoursesObjs);
  };

  const planItems = selectedIds
    .map((id) => ({ id, course: courses[id] }))
    .filter((x): x is { id: string; course: Course } => Boolean(x.course));

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <TermSelector selected={selectedTerm} setSelected={setSelectedTerm} />
        <button
          className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
          onClick={() => setPlanOpen(true)}
        >
          Course plan
        </button>
      </div>

      {/* Filter courses by selectedTerm and pass the current API */}
      <CourseList
        courses={Object.fromEntries(
          Object.entries(courses).filter(([, c]) => c.term === selectedTerm)
        )}
        selectedCourses={selectedIds}
        onToggle={onToggle}
        conflicts={conflicts}
      />

      <CoursePlanModal
        isOpen={planOpen}
        onClose={() => setPlanOpen(false)}
        items={planItems}
      />
    </section>
  );
}
