// src/components/Banner.tsx
import { signInWithGoogle, signOut, useAuthState } from '../utilities/firebase';

export default function Banner({ title }: { title: string }) {
  const { user } = useAuthState();

  return (
    <header className="w-full">
      {/* Top row: title left, welcome/signout right */}
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {user ? `Welcome, ${user.displayName}` : 'Welcome, guest'}
          </span>
          {user ? (
            <button
              className="rounded border px-3 py-1 hover:bg-gray-50"
              onClick={signOut}
            >
              Sign out
            </button>
          ) : (
            <button
              className="rounded border px-3 py-1 hover:bg-gray-50"
              onClick={signInWithGoogle}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Full-width divider aligned to the same wrapper */}
      <hr className="mt-4 border-gray-300" />
    </header>
  );
}
