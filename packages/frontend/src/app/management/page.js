"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { FaSearch, FaTrash, FaExchangeAlt, FaWarehouse } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ManagementPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [targetWarehouse, setTargetWarehouse] = useState("");
  const [filteredBlocks, setFilteredBlocks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = blocks.filter(
        (block) =>
          block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          block.tags.some((tag) =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredBlocks(filtered);
    } else {
      setFilteredBlocks(blocks);
    }
  }, [searchTerm, blocks]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [warehousesRes, blocksRes] = await Promise.all([
        axiosInstance.get("/warehouse"),
        axiosInstance.get("/bloc/all"),
      ]);
      setWarehouses(warehousesRes.data.warehouses);
      setBlocks(blocksRes.data);
      setFilteredBlocks(blocksRes.data);
    } catch (error) {
      toast.error("Error fetching data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSelect = (blockId) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockId)
        ? prev.filter((id) => id !== blockId)
        : [...prev, blockId]
    );
  };

  const handleMoveBlocks = async () => {
    if (!targetWarehouse || selectedBlocks.length === 0) {
      toast.error("Please select blocks and target warehouse");
      return;
    }

    try {
      for (const blockId of selectedBlocks) {
        await axiosInstance.put(`/bloc/change-warehouse/${blockId}`, {
          newWarehouseId: targetWarehouse,
        });
      }
      toast.success("Blocks moved successfully");
      setIsMoveModalOpen(false);

      setSelectedBlocks([]);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error moving blocks");
    }
  };

  const handleDeleteBlocks = async () => {
    if (selectedBlocks.length === 0) {
      toast.error("Please select blocks to delete");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected blocks?")) {
      return;
    }

    try {
      await Promise.all(
        selectedBlocks.map((blockId) =>
          axiosInstance.delete(`/bloc/${blockId}`)
        )
      );
      toast.success("Blocks deleted successfully");
      setSelectedBlocks([]);
      fetchData();
    } catch (error) {
      toast.error("Error deleting blocks");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Block Management
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search blocks by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setIsMoveModalOpen(true)}
            disabled={selectedBlocks.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaExchangeAlt className="mr-2" />
            Move Selected
          </button>
          <button
            onClick={handleDeleteBlocks}
            disabled={selectedBlocks.length === 0}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTrash className="mr-2" />
            Delete Selected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlocks.map((block) => (
          <div
            key={block._id}
            className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              selectedBlocks.includes(block._id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {block.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Warehouse: {block.warehouse?.name || "Unknown"}
                </p>
              </div>
              <input
                type="checkbox"
                checked={selectedBlocks.includes(block._id)}
                onChange={() => handleBlockSelect(block._id)}
                className="h-5 w-5 text-blue-600 rounded"
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-20">Dimensions:</span>
                <span>
                  {block.height}x{block.width}x{block.depth} cm
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-20">Weight:</span>
                <span>{block.weight || 0} kg</span>
              </div>
              {block.tags && block.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {block.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: tag.color,
                        color: "#fff",
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isMoveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Move Blocks</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Target Warehouse
              </label>
              <select
                value={targetWarehouse}
                onChange={(e) => setTargetWarehouse(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsMoveModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleMoveBlocks}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Move Blocks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementPage;
