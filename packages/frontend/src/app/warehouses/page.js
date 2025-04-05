"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import axiosInstance from "@/utils/axiosConfig";
import { FaUsers, FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import CollaboratorsModal from "@/components/CollaboratorsModal";
import EditWarehouseModal from "@/components/EditWarehouseModal";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const WarehousesList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    getWarehouses();
  }, []);

  const getWarehouses = async () => {
    axiosInstance.get("/warehouse").then((response) => {
      setWarehouses(response.data.warehouses);
    });
  };

  const updateSelectedWarehouse = async (warehouseId) => {
    try {
      const response = await axiosInstance.get(`/warehouse/${warehouseId}`);
      setSelectedWarehouse(response.data.warehouse);
    } catch (error) {
      console.error("Error updating selected warehouse:", error);
    }
  };

  const handleDelete = async (warehouseId) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        await axiosInstance.delete(`/warehouse/${warehouseId}`);
        toast.success("Warehouse deleted successfully");
        getWarehouses();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error deleting warehouse"
        );
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Warehouses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse._id}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 border border-gray-200"
          >
            <h3 className="text-2xl font-semibold text-gray-800">
              {warehouse.name}
            </h3>
            {warehouse.location && (
              <p className="text-gray-500 mt-1">
                {warehouse.location.city}, {warehouse.location.country}
              </p>
            )}
            <p className="text-gray-600 mt-3">{warehouse.description}</p>
            <p className="text-gray-400 mt-1 text-sm">
              Max Weight:{" "}
              <span className="font-semibold">{warehouse.maxWeight} kg</span>
            </p>

            <div className="flex justify-between mt-6">
              <Link
                href={`/warehouse/${warehouse._id}`}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
              >
                <FaEye /> View
              </Link>
              <button
                onClick={() => {
                  setSelectedWarehouse(warehouse);
                  setIsCollaboratorModalOpen(true);
                }}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600 transition"
              >
                <FaUsers /> Collaborators
              </button>
              <button
                onClick={() => {
                  setSelectedWarehouse(warehouse);
                  setIsEditModalOpen(true);
                }}
                disabled={warehouse.addedBy != user._id}
                className="flex items-center disabled:opacity-75 disabled:bg-gray-700 gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow hover:bg-yellow-600 transition"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={() => handleDelete(warehouse._id)}
                disabled={warehouse.addedBy != user._id}
                className="flex items-center gap-2 disabled:bg-gray-700 disabled:opacity-75 bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton flottant pour ajouter un entrepôt */}
      <Link
        href="/add-warehouse"
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center gap-2 text-lg"
      >
        <FaPlus /> Add Warehouse
      </Link>

      <CollaboratorsModal
        isOpen={isCollaboratorModalOpen}
        onClose={() => setIsCollaboratorModalOpen(false)}
        warehouse={selectedWarehouse}
        onUpdate={() => {
          getWarehouses();
          if (selectedWarehouse) {
            updateSelectedWarehouse(selectedWarehouse._id);
          }
        }}
        setWarehouse={setSelectedWarehouse}
      />

      <EditWarehouseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        warehouse={selectedWarehouse}
        onUpdate={getWarehouses}
      />
    </div>
  );
};

export default WarehousesList;
