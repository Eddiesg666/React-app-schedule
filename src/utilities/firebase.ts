// src/utilities/firebase.ts
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, update } from 'firebase/database';

// 🔁 Your config (what you already have)
const firebaseConfig = {
  apiKey: "AIzaSyBuPprQ_4j4zyECfTzMwmF377Mh17aXQpI",
  authDomain: "react-app-schedule-b1f91.firebaseapp.com",
  databaseURL: "https://react-app-schedule-b1f91-default-rtdb.firebaseio.com",
  projectId: "react-app-schedule-b1f91",
  storageBucket: "react-app-schedule-b1f91.firebasestorage.app",
  messagingSenderId: "270323697227",
  appId: "1:270323697227:web:5b7117438810ba1ebdafce",
  measurementId: "G-ZHM6G4FRNF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Read hook (unchanged)
export function useDataQuery(path: string): [unknown, boolean, Error | undefined] {
  const [data, setData] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    const off = onValue(
      ref(db, path),
      (snap) => {
        setData(snap.val());
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return off;
  }, [path]);

  return [data, loading, error];
}

// ✅ NEW: tiny helper for partial updates
export function updateAt(path: string, values: Record<string, unknown>) {
  return update(ref(db, path), values);
}
