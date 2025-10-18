// src/utilities/firebase.ts
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';

// 🟣 Replace with your real config from:
// Firebase console → Project settings → General → Your apps → Web app → "Config" radio button
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


// Initialize (singleton)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/** Subscribe to a Realtime Database path; returns [data, loading, error] */
export function useDataQuery(path: string): [unknown, boolean, Error | undefined] {
  const [data, setData] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    // Subscribe; Firebase returns an unsubscribe function
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

    return off; // cleanup: remove listener when unmounted or path changes
  }, [path]);

  return [data, loading, error];
}
