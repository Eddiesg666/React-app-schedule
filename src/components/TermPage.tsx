// src/components/TermPage.tsx
import { useState } from 'react';
import TermSelector, { type Term } from './TermSelector';
import CourseList from './CourseList';

type Course = {
  term: Term;
  number: string;
  meets: string;
  title: string;
};
export type CoursesById = Record<string, Course>;

// helper: add/remove id immutably
const toggleList = <T,>(x: T, lst: T[]) =>
  lst.includes(x) ? lst.filter((y) => y !== x) : [...lst, x];

export default function TermPage({ courses }: { courses: CoursesById }) {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => toggleList(id, prev));

  const selectedTitles = selectedIds.map((id) => {
    const c = courses[id];
    return c ? `${c.term} CS ${c.number}` : id;
    // you could also include c.title if you prefer
  });

  return (
    <section>
      <TermSelector selected={selectedTerm} setSelected={setSelectedTerm} />

      {/* Selected summary */}
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-1">Selected classes</h2>
        <ul className="ml-5 list-disc min-h-6">
          {selectedTitles.length === 0 ? (
            <li className="text-gray-500">None</li>
          ) : (
            selectedTitles.map((label) => <li key={`sel-${label}`}>{label}</li>)
          )}
        </ul>
      </div>

      <CourseList
        courses={courses}
        selectedTerm={selectedTerm}
        selectedIds={selectedIds}
        toggleSelected={toggleSelected}
      />
    </section>
  );
}
