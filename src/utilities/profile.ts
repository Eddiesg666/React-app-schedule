// src/utilities/profile.ts
import { useAuthState, useDataQuery } from './firebase';

type Profile = { user: ReturnType<typeof useAuthState>['user']; isAdmin: boolean };

export const useProfile = (): [Profile, boolean, Error | undefined] => {
  const { user } = useAuthState();

  // Read /admins/<uid>. Expect a boolean true for admins.
  const [raw, loading, error] = useDataQuery(`/admins/${user?.uid || 'guest'}`);

  // Coerce strictly to boolean true
  const isAdmin = raw === true;

  return [{ user, isAdmin }, loading, error];
};
