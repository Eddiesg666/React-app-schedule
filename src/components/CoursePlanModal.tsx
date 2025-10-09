// src/components/CoursePlanModal.tsx
import Modal from './Modal';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring';
  number: string;
  meets: string;
  title: string;
};

interface CoursePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ id: string; course: Course }>;
}

export default function CoursePlanModal({ isOpen, onClose, items }: CoursePlanModalProps) {
  const hasItems = items.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-3">Your course plan</h2>

      {!hasItems ? (
        <div className="text-gray-700">
          <p>No courses selected yet.</p>
          <p className="mt-1">Click any course card to add it to your plan.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map(({ id, course }) => (
            <li key={`plan-${id}`} className="border rounded-md p-3">
              <div className="font-semibold">
                {course.term} CS {course.number}
              </div>
              <div className="text-gray-800">{course.title}</div>
              <div className="text-sm text-gray-600 mt-1">{course.meets}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-end">
        <button
          className="px-3 py-1.5 rounded-md bg-black text-white hover:opacity-90"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
