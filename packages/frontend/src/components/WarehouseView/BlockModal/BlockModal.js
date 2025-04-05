"use client";
import axiosInstance from "@/utils/axiosConfig";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBoxOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import BlockVisualizer from "../../BlockVisualizer/BlockVisualizer";

import ContainedBlocksTab from "./ContainedBlocksTab";
import BlockInfoTab from "./BlockInfoTab";

const BlockModal = ({ blockId, show, onHide }) => {
  if (!show || !blockId) return null;

  const [block, setBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    setIsLoading(true);
    fetchBlock();
  }, [blockId]);

  useEffect(() => {
    if (!block) return;
    setIsLoading(true);
    fetchBlock();
  }, [activeTab]);

  const fetchBlock = async () => {
    try {
      const response = await axiosInstance.get(
        `/bloc/${blockId}?parentChain=true`
      );
      if (response.status === 200) {
        setBlock(response.data);
        console.log("Block data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching block:", error);
      toast.error("Error fetching block.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 m-8 overflow-hidden"
      >
        <div className="p-2">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-3xl font-bold text-blue-600 flex items-center">
              <FaBoxOpen className="mr-2" /> {block?.name || "Loading..."}
            </h2>
            <button
              onClick={onHide}
              className="text-gray-600 hover:text-red-500 text-2xl"
            >
              ✖
            </button>
          </div>

          <TabsContainer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            block={block}
          />
          <div className="p-4 overflow-y-scroll h-[70vh]">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
              </div>
            ) : block ? (
              <>
                {activeTab === "info" && <BlockInfoTab block={block} />}
                {activeTab === "contained" && (
                  <ContainedBlocksTab block={block} onEdit={fetchBlock} />
                )}
                {activeTab === "visualizer" &&
                  (block.blocs?.length > 0 ? (
                    <BlockVisualizer rootBlockId={blockId} />
                  ) : (
                    <div className="text-center py-10 text-gray-500 text-xl font-semibold">
                      <p>This block is empty.</p>
                    </div>
                  ))}
              </>
            ) : (
              <div className="text-center py-10 text-gray-500 text-xl font-semibold">
                Block not found
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TabsContainer = ({ activeTab, setActiveTab, block }) => (
  <div className="flex border-b">
    {[
      { id: "info", label: "Infos" },
      {
        id: "contained",
        label: `Contained Blocks (${
          block ? (block.blocs ? block.blocs.length : 0) : 0
        })`,
      },
      { id: "visualizer", label: "Visualizer" },
    ].map((tab) => (
      <button
        key={tab.id}
        className={`p-3 flex-1 text-center ${
          activeTab === tab.id
            ? "border-b-2 border-blue-500 font-bold"
            : "text-gray-600"
        }`}
        onClick={() => setActiveTab(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default BlockModal;
