"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosConfig";
import WarehouseView from "@/components/WarehouseView/WarehouseView";
import Button from "@/components/Button";
import BlockVisualizer from "@/components/BlockVisualizer/BlockVisualizer";

const WarehousePage = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlockVizualisationModalOpen, setIsBlockVizualisationModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await axiosInstance.get(`/warehouse/${id}`);
        console.log(response.data.warehouse);
        setWarehouse(response.data.warehouse);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* Détails du warehouse */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-md">
        <h1 className="text-xl font-bold">{warehouse.name}</h1>
        <div>
          <Button
            className="mr-2"
            onClick={() => setIsBlockVizualisationModalOpen(true)}
          >
            Block Visualization
          </Button>
          <Button className="mr-2">Update informations</Button>
        </div>
      </div>
      <WarehouseView warehouse={warehouse} />

      {isBlockVizualisationModalOpen && (
        <BlockVisualizer
          warehouse={warehouse}
          onClose={() => {
            setIsBlockVizualisationModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default WarehousePage;
