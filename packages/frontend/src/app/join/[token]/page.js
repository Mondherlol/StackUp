"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosConfig";
import Link from "next/link";

const JoinPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const join = async () => {
      try {
        const response = await axiosInstance.post(`/warehouse/${token}/join`);
        setMessage(response.data.message);
        // Redirect to /warehouses
        router.push("/warehouses");
      } catch (err) {
        console.log(err);
        setError(
          err.response.data.message || "The link is expired or invalid."
        );
      } finally {
        setLoading(false);
      }
    };

    join();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="text-center">
          {error ? (
            <div className="text-red-500">
              <p>{error}</p>
              <Link href={"/"} className="text-blue-500 underline">
                Go back to homepage
              </Link>
            </div>
          ) : (
            <div className="text-green-500">{message}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinPage;
