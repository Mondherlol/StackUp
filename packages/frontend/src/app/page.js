"use client";

import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="mt-6">
          <h1 className="text-3xl font-bold">Welcome back {user.username} !</h1>

          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Welcome on StackUp!</h1>

          <p className="mt-4 text-gray-600">
            Click on the button below for access to the platform.
          </p>
          <a
            href="/login"
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Let's begin !
          </a>
        </>
      )}
    </main>
  );
}
