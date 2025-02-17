"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import axiosInstance from "@/utils/axiosConfig";
import { FaUsers, FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import CollaboratorsModal from "@/components/CollaboratorsModal";
import { toast } from "react-hot-toast";

const WarehousesList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

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
      setSelectedWarehouse(response.data.warehouse); // Met à jour l'entrepôt dans le modal
    } catch (error) {
      console.error("Error updating selected warehouse:", error);
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
              <button className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow hover:bg-yellow-600 transition">
                <FaEdit /> Edit
              </button>
              <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition">
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
          getWarehouses(); // 🔹 Met à jour la liste des entrepôts
          if (selectedWarehouse) {
            updateSelectedWarehouse(selectedWarehouse._id); // 🔹 Rafraîchit l'entrepôt dans le modal
          }
        }}
        setWarehouse={setSelectedWarehouse}
      />
    </div>
  );
};

export default WarehousesList;
