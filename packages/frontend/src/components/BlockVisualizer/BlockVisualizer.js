import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import Treemap from "./Treemap";

const BlockVisualizer = ({ rootBlockId, warehouse, onClose }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distributionMode, setDistributionMode] = useState("width");

  useEffect(() => {
    const fetchBlock = async (blockId) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/bloc/${blockId}`);
        if (response.status === 200) {
          setBlocks(response.data.blocs);
        }
      } catch (err) {
        setError("Failed to load blocks");
      } finally {
        setLoading(false);
      }
    };
    fetchBlock(rootBlockId);
  }, [rootBlockId]);

  useEffect(() => {
    if (!warehouse) return;
    setBlocks(warehouse.blocs);
    setLoading(false);
  }, [warehouse]);

  const treemapData = {
    name: "root",
    children: blocks.map((block) => ({
      name: block.name,
      value:
        distributionMode === "volume"
          ? (block.width ?? 1) * (block.height ?? 1) * (block.depth ?? 1)
          : block[distributionMode] ?? 1,
    })),
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] w-[600px] h-[500px] flex flex-col relative">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Block Visualization</h2>
        <select
          className="mb-4 p-2 border rounded"
          value={distributionMode}
          onChange={(e) => setDistributionMode(e.target.value)}
        >
          <option value="width">Width</option>
          <option value="height">Height</option>
          <option value="depth">Depth</option>
          <option value="volume">Volume</option>
        </select>
        <div className="flex-grow flex justify-center items-center overflow-hidden">
          <Treemap data={treemapData} width={400} height={350} />
        </div>
      </div>
    </div>
  );
};

export default BlockVisualizer;
