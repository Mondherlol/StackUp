"use client";
import { useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { motion } from "framer-motion";
const { getBackendImageUrl } = require("@/utils/imageUrl");

const ContainedBlocksTab = ({ block }) => {
  const [search, setSearch] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Search blocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {block.blocs
          .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
          .map((childBlock) => (
            <BlockCard key={childBlock._id} block={childBlock} />
          ))}
      </div>
    </div>
  );
};

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

export default ContainedBlocksTab;
