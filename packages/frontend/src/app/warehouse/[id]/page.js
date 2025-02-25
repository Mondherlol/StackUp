"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosConfig";
import WarehouseView from "@/components/WarehouseView/WarehouseView";
import BlockVisualizerModal from "@/components/BlockVisualizer/BlockVisualizerModal";
import { Search, Eye } from "lucide-react";
import SearchModal from "@/components/SearchModal";
import BlockModal from "@/components/WarehouseView/BlockModal/BlockModal";

const WarehousePage = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlockVizualisationModalOpen, setIsBlockVizualisationModalOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await axiosInstance.get(`/warehouse/${id}`);
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
    <div className="flex  flex-col h-screen p-4 bg-gray-100">
      {/* Détails du warehouse */}
      <div className="flex gap-8 items-center bg-white p-4 shadow-md rounded-md">
        <h1 className="text-xl font-bold hidden sm:flex">{warehouse.name}</h1>

        {/* Barre de recherche */}
        <div className="  relative  w-full max-w-md  ">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSearchModalOpen(true);
            }}
          >
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>
      </div>

      <WarehouseView warehouse={warehouse} />

      {/* Bouton flottant pour la visualisation des blocs */}
      <button
        onClick={() => setIsBlockVizualisationModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        <Eye size={24} />
      </button>

      {isBlockVizualisationModalOpen && (
        <BlockVisualizerModal
          warehouse={warehouse}
          onClose={() => setIsBlockVizualisationModalOpen(false)}
        />
      )}

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        query={searchQuery}
        setQuery={setSearchQuery}
        onClick={(bloc) => {
          setIsSearchModalOpen(false);
          setIsBlockModalOpen(true);
          setSelectedBlock(bloc);
        }}
      />

      <BlockModal
        show={isBlockModalOpen}
        onHide={() => setIsBlockModalOpen(false)}
        blockId={selectedBlock?._id}
      />
    </div>
  );
};

export default WarehousePage;
