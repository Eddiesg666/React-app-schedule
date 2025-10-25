// src/utilities/firebase.ts
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  onValue,
  ref,
  type Database,
} from 'firebase/database';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

// --- Your project config (use the same values you already posted) ---
const firebaseConfig = {
  apiKey: 'AIzaSyBuPprQ_4j4zyECfTzMwmF377Mh17aXQpI',
  authDomain: 'react-app-schedule-b1f91.firebaseapp.com',
  databaseURL: 'https://react-app-schedule-b1f91-default-rtdb.firebaseio.com',
  projectId: 'react-app-schedule-b1f91',
  storageBucket: 'react-app-schedule-b1f91.firebasestorage.app',
  messagingSenderId: '270323697227',
  appId: '1:270323697227:web:5b7117438810ba1ebdafce',
  measurementId: 'G-ZHM6G4FRNF',
};

// --- Initialize core Firebase objects and export them ---
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const database: Database = getDatabase(app); // <== exported as "database"
const auth = getAuth(app);

// --- Simple auth actions ---
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const signOut = () => firebaseSignOut(auth);

// --- Auth hook ---
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
}

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // subscribe to auth changes
    const unsub = onAuthStateChanged(auth, (u) => {
      // ensure React updates synchronously so the UI reflects auth ASAP
      flushSync(() => {
        setUser(u);
        setIsInitialLoading(false);
      });
    });
    return unsub;
  }, []);

  return { user, isAuthenticated: !!user, isInitialLoading };
};

// --- Realtime Database hook ---
export const useDataQuery = (
  path: string
): [unknown, boolean, Error | undefined] => {
  const [data, setData] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    const r = ref(database, path);
    const unsub = onValue(
      r,
      (snap) => {
        setData(snap.val());
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return unsub; // cleanup listener
  }, [path]);

  return [data, loading, error];
};
