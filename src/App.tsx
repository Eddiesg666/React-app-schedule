// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import TermPage from './components/TermPage';
import CourseForm from './components/CourseForm';
import { useDataQuery } from './utilities/firebase';
import type { Term } from './components/TermSelector';

// Reuse the same Term type TermPage uses (no Summer here)
type Course = {
  term: Term;                 // <-- matches TermPage expectation
  number: string;
  meets: string;
  title: string;
};

type CoursesById = Record<string, Course>;
type Schedule = {
  title: string;
  courses: CoursesById;
};

export default function App() {
  // NOTE: do NOT write <Schedule> here; the hook isn't generic.
  const [json, isLoading, error] = useDataQuery('/');  // or '/schedule' if you nested it

  if (error)
    return (
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1>Loading error: {String(error.message || error)}</h1>
      </main>
    );

  if (isLoading || !json)
    return (
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1>Loading…</h1>
      </main>
    );

  const schedule = json as Schedule;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="max-w-6xl mx-auto px-4 py-6">
            <Banner title={schedule.title} />
            <TermPage courses={schedule.courses} />
          </main>
        }
      />
      <Route
        path="/courses/:id/edit"
        element={<CourseForm courses={schedule.courses} />}
      />
    </Routes>
  );
}
