// src/components/TermPage.tsx
import { useMemo, useState } from 'react';
import CourseList from './CourseList';
import Modal from './Modal';
import type { CoursesById } from '../types/courses';
import { conflictsWithAny } from '../utilities/conflicts';

type Term = 'Fall' | 'Winter' | 'Spring' | 'Summer';

interface TermPageProps {
  courses: CoursesById;
}

export default function TermPage({ courses }: TermPageProps) {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [planOpen, setPlanOpen] = useState(false);

  const courseArray = useMemo(
    () => Object.entries(courses).map(([id, c]) => ({ id, ...c })),
    [courses]
  );

  const visible = useMemo(
    () => courseArray.filter((c) => c.term === selectedTerm),
    [courseArray, selectedTerm]
  );

  const selectedCourseObjects = useMemo(
    () => selectedCourses.map((id) => ({ id, ...courses[id] })),
    [selectedCourses, courses]
  );

  const conflicts = (id: string) => {
    const target = courses[id];
    if (!target) return false;
    const others = selectedCourseObjects.filter((c) => c.id !== id);
    return conflictsWithAny(target, others);
  };

  const toggle = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    // ⬇️ add top margin to push controls (and Course plan) down from the banner’s line
    <div className="w-full mt-8">
      {/* Term selector + Course plan button (still aligned horizontally) */}
      <div className="flex items-center gap-2 mb-4">
        {(['Fall', 'Winter', 'Spring', 'Summer'] as Term[]).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTerm(t)}
            className={`px-3 py-1 rounded border ${
              selectedTerm === t ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
          >
            {t}
          </button>
        ))}

        <button
          onClick={() => setPlanOpen(true)}
          className="ml-auto px-3 py-1 rounded border bg-white"
        >
          Course plan
        </button>
      </div>

      <CourseList
        courses={Object.fromEntries(visible.map((c) => [c.id, c]))}
        selectedCourses={selectedCourses}
        onToggle={toggle}
        conflicts={conflicts}
      />

      <Modal isOpen={planOpen} onClose={() => setPlanOpen(false)}>
        <h2 className="text-lg font-bold mb-2">Your course plan</h2>
        {selectedCourses.length === 0 ? (
          <p className="text-sm">
            No courses selected yet. Click a course card to select it; click
            again to unselect.
          </p>
        ) : (
          <ul className="list-disc ml-6">
            {selectedCourses.map((id) => {
              const c = courses[id];
              return (
                <li key={id}>
                  CS {c.number} — {c.title} ({c.meets || 'TBA'})
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </div>
  );
}
