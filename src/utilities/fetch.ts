// src/utilities/fetch.ts
import { useEffect, useState } from 'react';

export type JsonQueryResult<T> = [T | undefined, boolean, Error | null];

/**
 * Fetch JSON from a URL and expose [data, isLoading, error]
 */
export function useJsonQuery<T = unknown>(url: string): JsonQueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(undefined);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = (await res.json()) as T;
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [url]);

  return [data, loading, error];
}
