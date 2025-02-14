"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import axiosInstance from "@/utils/axiosConfig";

const WarehousesList = () => {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    axiosInstance.get("/warehouse").then((response) => {
      setWarehouses(response.data.warehouses);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Warehouses</h2>
      <Link
        href="/add-warehouse"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        + Add Warehouse
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{warehouse.name}</h3>
            {warehouse.location && (
              <p className="text-gray-600">
                {warehouse.location.city}, {warehouse.location.country}
              </p>
            )}

            <p className="text-gray-700 mt-2 text-sm">
              {warehouse.description}
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Max Weight: {warehouse.maxWeight} kg
            </p>
            <Link
              href={`/warehouse/${warehouse._id}`}
              className="block text-blue-500 mt-4 hover:underline"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehousesList;
