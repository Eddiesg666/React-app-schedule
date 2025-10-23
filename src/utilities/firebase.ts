// src/utilities/firebase.ts
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { initializeApp } from 'firebase/app';
import {
  getDatabase, onValue, ref, update,
} from 'firebase/database';
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged,
  signInWithPopup, signOut as fbSignOut, type User, type NextOrObserver,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBuPprQ_4j4zyECfTzMwmF377Mh17aXQpI",
  authDomain: "react-app-schedule-b1f91.firebaseapp.com",
  databaseURL: "https://react-app-schedule-b1f91-default-rtdb.firebaseio.com",
  projectId: "react-app-schedule-b1f91",
  storageBucket: "react-app-schedule-b1f91.firebasestorage.app",
  messagingSenderId: "270323697227",
  appId: "1:270323697227:web:5b7117438810ba1ebdafce",
  measurementId: "G-ZHM6G4FRNF" // optional
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------- Data (read) ----------
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

// ---------- Data (write) ----------
export function updateAt(path: string, values: Record<string, unknown>) {
  return update(ref(db, path), values);
}

// ---------- Auth ----------
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signOut = () => fbSignOut(auth);

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
}

export const addAuthStateListener = (fn: NextOrObserver<User>) =>
  onAuthStateChanged(auth, fn);

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => addAuthStateListener((u) => {
    // flushSync ensures UI updates immediately (optional but nice)
    flushSync(() => {
      setUser(u);
      setIsInitialLoading(false);
    });
  }), []);

  return { user, isAuthenticated: !!user, isInitialLoading };
};
