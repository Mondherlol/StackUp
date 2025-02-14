"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="mt-6">
          <h1 className="text-3xl font-bold">Welcome {user.username} !</h1>

          <h4>You don't have any warehouse yet.</h4>

          <Link
            href={"/add-warehouse"}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700"
          >
            Create a warehouse
          </Link>

          <button className="mx-4 px-4 py-2 bg-yellow-300 text-white rounded-lg hover:bg-yellow-400">
            Join an existing warehouse
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
