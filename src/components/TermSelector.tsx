// src/components/TermSelector.tsx
import type { Dispatch, SetStateAction } from 'react';

export type Term = 'Fall' | 'Winter' | 'Spring';

interface TermSelectorProps {
  selected: Term;
  setSelected: Dispatch<SetStateAction<Term>>;
}

const terms: Term[] = ['Fall', 'Winter', 'Spring'];

export default function TermSelector({ selected, setSelected }: TermSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      {terms.map(term => {
        const active = term === selected;
        return (
          <button
            key={term}
            type="button"
            onClick={() => setSelected(term)}
            className={[
              'px-3 py-1.5 rounded-md border text-sm',
              active
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            ].join(' ')}
            aria-pressed={active}
          >
            {term}
          </button>
        );
      })}
    </div>
  );
}
