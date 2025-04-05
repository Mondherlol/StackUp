"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FaWarehouse, FaBoxes, FaUsers, FaChartLine } from "react-icons/fa";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {user ? (
        <div className="text-center space-y-8 p-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 animate-fade-in">
              Welcome back, {user.username}!
            </h1>
            <p className="text-xl text-gray-600">
              Ready to manage your warehouses?
            </p>
          </div>

          <div className="flex justify-center gap-8 my-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FaWarehouse className="w-10 h-10" />
                </div>
                <Link
                  href="/warehouses"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-xl"
                >
                  Go to Warehouses
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                Welcome to StackUp
              </h1>
              <p className="text-lg text-gray-600">
                Your smart warehouse management solution
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: <FaWarehouse className="w-8 h-8" />,
                  title: "Warehouse Management",
                },
                {
                  icon: <FaBoxes className="w-8 h-8" />,
                  title: "Storage Blocks",
                },
                {
                  icon: <FaUsers className="w-8 h-8" />,
                  title: "Team Collaboration",
                },
                {
                  icon: <FaChartLine className="w-8 h-8" />,
                  title: "Inventory Tracking",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {feature.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {feature.title}
                  </h2>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-xl"
              >
                Get Started
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
