// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Banner from './components/Banner';
import TermPage from './components/TermPage';
import CourseForm from './components/CourseForm';
import { useDataQuery, useAuthState } from './utilities/firebase';
import { useProfile } from './utilities/profile';
import type { CoursesById } from './types/courses';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialLoading } = useAuthState();
  if (isInitialLoading) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        <h1>Loading…</h1>
      </main>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [{ isAdmin }, loading, error] = useProfile();
  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        <h1>Loading…</h1>
      </main>
    );
  }
  if (error) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        <h1>Profile load error</h1>
      </main>
    );
  }
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  // ✅ Read only the nodes we allow publicly: /title and /courses
  const [titleRaw, loadingTitle, errorTitle] = useDataQuery('/title');
  const [coursesRaw, loadingCourses, errorCourses] = useDataQuery('/courses');

  if (errorTitle || errorCourses) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        <h1>
          Error loading data:{' '}
          {String(errorTitle ?? errorCourses)}
        </h1>
      </main>
    );
  }

  if (loadingTitle || loadingCourses || titleRaw === undefined || coursesRaw === undefined) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        <h1>Loading courses…</h1>
      </main>
    );
  }

  const title = (titleRaw as string) ?? 'CS Course Scheduler';
  const courses = (coursesRaw as CoursesById) ?? {};

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="max-w-[1200px] mx-auto px-8 py-8">
            <Banner title={title} />
            <TermPage courses={courses} />
          </main>
        }
      />
      <Route
        path="/courses/:id/edit"
        element={
          <RequireAuth>
            <RequireAdmin>
              <main className="max-w-[1200px] mx-auto px-8 py-8">
                <Banner title={title} />
                <CourseForm courses={courses} />
              </main>
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
