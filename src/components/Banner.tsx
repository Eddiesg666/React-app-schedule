// src/components/Banner.tsx
import { signInWithGoogle, signOut, useAuthState } from '../utilities/firebase';

export default function Banner({ title }: { title: string }) {
  const { user, isInitialLoading } = useAuthState();

  return (
    <>
      <div className="p-3 flex items-center gap-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
          {!isInitialLoading && (
            <>
              <span className="text-sm text-gray-600">
                {user ? `Welcome, ${user.displayName ?? user.email}` : 'Welcome, guest'}
              </span>
              {user ? (
                <button
                  className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                  onClick={signOut}
                >
                  Sign out
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={signInWithGoogle}
                >
                  Sign in with Google
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <hr className="my-4" />
    </>
  );
}
