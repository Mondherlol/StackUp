import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import Treemap from "./Treemap";

const BlockVisualizer = ({ rootBlockId, warehouse, onEdit }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distributionMode, setDistributionMode] = useState("volume");
  const [history, setHistory] = useState([]);
  const [rootColor, setRootColor] = useState(null);
  const [rootName, setRootName] = useState("");

  useEffect(() => {
    fetchBlock(rootBlockId, null);
  }, [rootBlockId]);

  const handleOnEdit = () => {
    if (onEdit) onEdit();
    else fetchBlock(rootBlockId, null);
  };

  const fetchBlock = async (blockId, color) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/bloc/${blockId}`);
      if (response.status === 200) {
        // Ajouter l'état uniquement si ce n'est pas un premier appel
        if (history.length > 0 || blockId !== rootBlockId) {
          setHistory((prev) => [...prev, { blocks, rootColor }]);
        }
        setBlocks(response.data.blocs);
        setRootColor(color || null);
        setRootName(response.data.name);
      }
    } catch (err) {
      setError("Failed to load blocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!warehouse) return;

    // Empêcher les updates inutiles (surtout si warehouse est identique)
    setBlocks((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(warehouse.blocs);
      return same ? prev : warehouse.blocs;
    });

    setRootName(warehouse.name);
    setLoading(false);
  }, [warehouse]);

  const handleGoBack = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setBlocks(lastState.blocks);
      setRootColor(lastState.rootColor);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const treemapData = {
    name: `${rootName}`,
    children: blocks.map((block) => ({
      name: block.name,
      _id: block._id,
      nb_blocks: block.blocs.length,
      value:
        distributionMode === "volume"
          ? (block.width ?? 1) * (block.height ?? 1) * (block.depth ?? 1)
          : block[distributionMode] ?? 1,
    })),
  };

  const handleOnClick = (block, color) => {
    fetchBlock(block._id, color);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleGoBack}
          disabled={history.length === 0}
          className={`px-4 py-2 rounded-lg text-white shadow-md ${
            history.length > 0
              ? "bg-blue-500 hover:bg-blue-600 transition"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          ⬅ Revenir
        </button>
        <select
          className="p-2 border rounded-lg flex-grow"
          value={distributionMode}
          onChange={(e) => setDistributionMode(e.target.value)}
        >
          <option value="width">Width</option>
          <option value="height">Height</option>
          <option value="depth">Depth</option>
          <option value="volume">Volume</option>
        </select>
      </div>
      <div className="flex-grow flex justify-center items-center overflow-hidden">
        <Treemap
          data={treemapData}
          width={450}
          height={400}
          handleOnClick={handleOnClick}
          rootColor={rootColor}
          distributionMode={distributionMode}
          onEdit={handleOnEdit}
        />
      </div>
    </div>
  );
};

export default BlockVisualizer;
