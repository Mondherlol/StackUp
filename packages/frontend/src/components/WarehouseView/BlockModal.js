"use client";
import axiosInstance from "@/utils/axiosConfig";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaWeight, FaBoxOpen, FaRulerCombined, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import BlockVisualizer from "./BlockVisualizer";
const { getBackendImageUrl } = require("@/utils/imageUrl");

const BlockModal = ({ blockId, show, onHide }) => {
  if (!show || !blockId) return null;

  const [block, setBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBlock = async () => {
    try {
      const response = await axiosInstance.get(`/bloc/${blockId}`);
      if (response.status === 200) {
        setBlock(response.data);
      }
    } catch (error) {
      console.error("Error fetching block:", error);
      toast.error("Error fetching block.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchBlock();
  }, [blockId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 m-8 overflow-hidden"
      >
        <div className=" p-2">
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

          <div className=" overflow-y-scroll max-h-[80vh] p-2 ">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
              </div>
            ) : block ? (
              <>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-${
                    block.picture ? "2" : "1"
                  } gap-4 mt-4 `}
                >
                  {block.picture && (
                    <img
                      src={getBackendImageUrl(block.picture)}
                      alt={block.name}
                      className="mx-auto my-4 rounded-lg shadow-md max-w-sm object-cover h-48"
                    />
                  )}

                  <div className="grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded-lg shadow">
                    <DetailRow
                      icon={FaRulerCombined}
                      label="Dimensions"
                      value={`${block.width ?? "N/A"} x ${
                        block.height ?? "N/A"
                      } x ${block.depth ?? "N/A"}`}
                    />
                    <DetailRow
                      icon={FaWeight}
                      label="Weight"
                      value={`${block.weight ?? "N/A"} kg`}
                    />
                    <DetailRow
                      icon={FaWeight}
                      label="Max Weight"
                      value={`${block.maxWeight ?? "N/A"} kg`}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                  <FaClock className="mr-2" /> Created on{" "}
                  <strong>
                    {block.createdAt
                      ? new Date(block.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </strong>
                  by <strong>{block.addedBy?.username ?? "Unknown"}</strong>,
                  last updated on{" "}
                  <strong>
                    {block.lastUpdate
                      ? new Date(block.lastUpdate).toLocaleString()
                      : "Unknown"}
                  </strong>
                  .
                </p>

                {block.blocs?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-blue-600">
                      Contained Blocks ({block.blocs.length})
                    </h3>
                    <input
                      type="text"
                      placeholder="Search blocks..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {block.blocs
                        .filter((b) =>
                          b.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((childBlock) => (
                          <BlockCard key={childBlock._id} block={childBlock} />
                        ))}
                    </div>
                  </div>
                )}

                <BlockVisualizer initialBlockId={blockId} />
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onHide}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
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

const DetailRow = ({ icon: Icon, label, value }) => (
  <p className="flex gap-2 items-center text-gray-700 bg-white p-3 rounded-lg shadow-sm">
    <Icon className="mr-2 text-blue-500" />
    <strong>{label}:</strong> {value}
  </p>
);

const BlockCard = ({ block }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
  >
    {block.picture && (
      <img
        src={getBackendImageUrl(block.picture)}
        alt={block.name}
        className="w-full h-32 object-cover rounded-lg mb-2"
      />
    )}
    <h4 className="text-lg font-semibold text-blue-600 flex items-center">
      <FaBoxOpen className="mr-2" /> {block.name}
    </h4>
    <p className="text-gray-700">
      <strong>Dimensions:</strong> {block.width ?? "N/A"} x{" "}
      {block.height ?? "N/A"} x {block.depth ?? "N/A"}
    </p>
    <p className="text-gray-700">
      <strong>Weight:</strong> {block.weight ?? "N/A"} kg
    </p>
  </motion.div>
);

export default BlockModal;
