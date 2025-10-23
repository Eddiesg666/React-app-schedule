// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import Banner from './components/Banner';
import TermPage from './components/TermPage';
import CourseForm from './components/CourseForm';
import { useDataQuery, useAuthState } from './utilities/firebase';
import type { Term } from './components/TermSelector';

// ---- Types that match what TermPage expects ----
type Course = {
  term: Term;            // 'Fall' | 'Winter' | 'Spring'
  number: string;
  meets: string;
  title: string;
};
type CoursesById = Record<string, Course>;

// What comes from Firebase (may include 'Summer' or other shapes)
type ScheduleFromDb = {
  title: string;
  courses: Record<string, { term: string; number: string; meets: string; title: string }>;
};

// Narrow unknown string to Term (or null if not allowed)
const toTerm = (t: string): Term | null =>
  t === 'Fall' || t === 'Winter' || t === 'Spring' ? t as Term : null;

// ---- Auth guard for the edit route ----
function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialLoading } = useAuthState();
  if (isInitialLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1>Loading…</h1>
      </main>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  // If your data in Firebase is at the root with { title, courses }, use '/'.
  // If you nested under /schedule, change to '/schedule'.
  const [json, isLoading, error] = useDataQuery('/');

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1>Loading error: {String((error as Error).message || error)}</h1>
      </main>
    );
  }

  if (isLoading || !json) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1>Loading…</h1>
      </main>
    );
  }

  // Normalize DB payload → coerce fields to strings and drop non-Term (e.g., Summer)
  const db = json as ScheduleFromDb;

  const courses: CoursesById = Object.fromEntries(
    Object.entries(db.courses ?? {}).flatMap(([id, c]) => {
      const term = toTerm(String(c.term));
      if (!term) return []; // drop Summer or unexpected term values
      return [[
        id,
        {
          term,
          number: String(c.number),
          meets: String(c.meets ?? ''),
          title: String(c.title),
        } satisfies Course,
      ]];
    })
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="max-w-6xl mx-auto px-4 py-6">
            <Banner title={String(db.title ?? 'Courses')} />
            <TermPage courses={courses} />
          </main>
        }
      />
      <Route
        path="/courses/:id/edit"
        element={
          <RequireAuth>
            {/* Pass the same normalized map to keep types consistent */}
            <CourseForm courses={courses} />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
