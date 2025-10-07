// src/App.tsx
import Banner from './components/Banner';
import TermPage from './components/TermPage';
import { useJsonQuery } from './utilities/fetch';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring';
  number: string;
  meets: string;
  title: string;
};

type Schedule = {
  title: string;
  courses: Record<string, Course>;
};

const DATA_URL =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';

export default function App() {
  const [schedule, isLoading, error] = useJsonQuery<Schedule>(DATA_URL);

  if (error) return <main className="max-w-6xl mx-auto px-4 py-6"><h1>Error loading courses: {String(error)}</h1></main>;
  if (isLoading || !schedule) return <main className="max-w-6xl mx-auto px-4 py-6"><h1>Loading courses…</h1></main>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <Banner title={schedule.title} />
      <TermPage courses={schedule.courses} />
    </main>
  );
}
