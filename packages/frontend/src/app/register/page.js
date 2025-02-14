"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/utils/axiosConfig";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Vérifier si tous les champs sont remplis
    const isFormValid = Object.values(formData).every((value) => value !== "");
    setCanSubmit(isFormValid);

    // Vérifier si les mots de passe correspondent
    if (name === "confirmPassword" || name === "password") {
      if (
        (formData.password !== value && name === "confirmPassword") ||
        (name === "password" && value !== formData.confirmPassword)
      ) {
        setError("Passwords do not match");
        setCanSubmit(false);
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/register", formData);

      console.log(response.data);

      // Show success message
      toast.success("Account created successfully !");

      // Redirect to home page after 1 second
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300 pr-10"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full px-4 py-2 font-bold text-white rounded-md focus:outline-none focus:ring ${
              !canSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
            }`}
          >
            Sign Up
          </button>
        </form>
        <h5 className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="#"
            onClick={() => router.push("/login")}
            className="text-blue-500"
          >
            Login
          </a>
        </h5>
      </div>
    </div>
  );
};

export default RegisterPage;
