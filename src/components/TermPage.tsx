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

export default function TermPage({ courses }: { courses: CoursesById }) {
  const [selected, setSelected] = useState<Term>('Fall');

  return (
    <section>
      <TermSelector selected={selected} setSelected={setSelected} />
      <CourseList courses={courses} selectedTerm={selected} />
    </section>
  );
}
