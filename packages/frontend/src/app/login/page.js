"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Get the login function from the context

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/user/login", formData);
      const { token, user } = response.data;

      login(user, token); // Stock the user and token in the context

      toast.success("Login successful!");

      // Redirect to the home page
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-blue-700">Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded-md w-64"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 border rounded-md w-64"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Log in
        </button>
      </form>
      <h5 className="pt-4 text-gray-700">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-700">
          Sign up
        </a>
      </h5>
    </main>
  );
}
