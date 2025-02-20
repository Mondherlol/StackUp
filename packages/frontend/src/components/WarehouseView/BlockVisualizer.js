"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosConfig";

const BlockVisualizer = ({ initialBlockId }) => {
  const [currentBlock, setCurrentBlock] = useState(null);
  const [blockHistory, setBlockHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialBlockId) return;
    fetchBlock(initialBlockId);
  }, [initialBlockId]);

  const fetchBlock = async (blockId) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/bloc/${blockId}`);
      if (response.status === 200) {
        console.log("Block fetched:", response.data);
        setBlockHistory((prev) => [...prev, response.data]);
        setCurrentBlock(response.data);
      }
    } catch (error) {
      console.error("Error fetching block:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToBlock = (blockId) => {
    fetchBlock(blockId);
  };

  const goBack = () => {
    if (blockHistory.length > 1) {
      const newHistory = [...blockHistory];
      newHistory.pop();
      setBlockHistory(newHistory);
      setCurrentBlock(newHistory[newHistory.length - 1]);
    }
  };

  return (
    <div className="p-4 w-full h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Block Viewer</h2>
        {blockHistory.length > 1 && (
          <button
            onClick={goBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
          >
            Retour
          </button>
        )}
      </div>
      <div className="relative flex-1 border bg-white shadow-lg p-4 rounded-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            Chargement...
          </div>
        ) : (
          <div className="relative w-full h-full">
            {currentBlock?.blocs?.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 w-full h-full">
                {currentBlock.blocs.map((block) => (
                  <motion.div
                    key={block._id}
                    className="bg-blue-300 hover:bg-blue-400 p-4 rounded-md cursor-pointer text-center text-white text-sm font-bold flex items-center justify-center"
                    onClick={() => navigateToBlock(block._id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: `${Math.max(10, block.size / 10)}%`,
                      height: `${Math.max(10, block.size / 10)}%`,
                    }}
                  >
                    {block.name}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                Aucun sous-bloc
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockVisualizer;
