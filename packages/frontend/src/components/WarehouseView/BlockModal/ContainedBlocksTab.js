import { useEffect, useRef, useState } from "react";
import { FaBoxOpen, FaSearch, FaEllipsisV } from "react-icons/fa";
import { motion } from "framer-motion";
import CreateBlockModal from "@/components/CreateBlockModal";
const { getBackendImageUrl } = require("@/utils/imageUrl");

const ContainedBlocksTab = ({ block }) => {
  const [search, setSearch] = useState("");
  const [isCreateBlockModalOpen, setIsCreateBlockModalOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-row gap-2 items-center mb-4">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <FaSearch
            size={25}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <span className="mx-2 text-gray-500">or</span>
        <button
          className="bg-blue-600 min-w-28 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => setIsCreateBlockModalOpen(true)}
        >
          Add Block
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {block.blocs
          .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
          .map((childBlock) => (
            <BlockCard key={childBlock._id} block={childBlock} />
          ))}
      </div>

      {block && isCreateBlockModalOpen && (
        <CreateBlockModal
          isOpen={isCreateBlockModalOpen}
          onClose={() => setIsCreateBlockModalOpen(false)}
          onCreate={(bloc) => {
            block.blocs.push(bloc);
          }}
          warehouseId={block.warehouse}
          parent={block}
        />
      )}
    </div>
  );
};

const BlockCard = ({ block }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleView = () => {
    console.log("View Block", block);
  };

  const handleEdit = () => {
    console.log("Edit Block", block);
  };

  const handleDelete = () => {
    console.log("Delete Block", block);
  };

  return (
    <motion.div className="relative bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition">
      {block.picture ? (
        <img
          src={getBackendImageUrl(block.picture)}
          alt={block.name}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
      ) : (
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg mb-2">
          <span className="text-gray-600 font-semibold text-lg">
            {block.name}
          </span>
        </div>
      )}

      <h4 className="text-lg font-semibold text-blue-600 flex items-center">
        <FaBoxOpen className="mr-2" /> {block.name}
      </h4>
      <p className="text-gray-700">
        <strong>Dimensions:</strong> {block.width ?? "N/A"} x{" "}
        {block.height ?? "N/A"} x {block.depth ?? "N/A"}
      </p>

      <div className="flex flex-wrap gap-2 mt-1 ">
        {block.tags.length === 0 && (
          <p className="text-gray-500 text-sm">No tags</p>
        )}
        {block.tags.map((tag) => (
          <div
            key={tag._id}
            className="flex items-center px-2 py-1 border rounded text-sm"
            style={{ backgroundColor: tag.color, color: "#fff" }}
          >
            {tag.name}
          </div>
        ))}
      </div>

      {/* Menu dropdown */}
      <div className="absolute top-40 right-2" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-gray-900"
        >
          <FaEllipsisV size={20} />
        </button>
        {isMenuOpen && (
          <div className="absolute right-5 -top-5 bg-white border rounded-lg shadow-lg w-40 mt-2 z-50">
            <button
              onClick={handleView}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              View Block
            </button>
            <button
              onClick={handleEdit}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Edit Block
            </button>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Delete Block
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContainedBlocksTab;
