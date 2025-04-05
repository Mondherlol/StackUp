"use client";
import { FaWeight, FaRulerCombined, FaClock } from "react-icons/fa";
import NotesSection from "./NoteSection";
import BlockModal from "./BlockModal";
import { useState } from "react";
const { getBackendImageUrl } = require("@/utils/imageUrl");

const BlockInfoTab = ({ block }) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const handleBlockClick = (blockId) => {
    setSelectedBlockId(blockId);
    setIsBlockModalOpen(true);
  };
  const handleBlockModalClose = () => {
    setIsBlockModalOpen(false);
    setSelectedBlockId(null);
  };
  return (
    <>
      {block?.parentChain && (
        <div className=" text-sm text-gray-600 px-2">
          <span>root &gt; </span>
          {block.parentChain.map((parent, index) => (
            <span key={parent._id}>
              {index > 0 && " > "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleBlockClick(parent._id)}
              >
                {parent.name}
              </button>
            </span>
          ))}
          <span>
            {block.parentChain.length > 0 && " > "}
            <button className="text-blue-500 hover:underline">
              {block.name}
            </button>
          </span>
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-${
          block.picture ? "2" : "1"
        } gap-4  `}
      >
        {block.picture && (
          <img
            src={getBackendImageUrl(block.picture)}
            alt={block.name}
            className="mx-auto my-4 rounded-lg shadow-md max-w-sm object-cover h-48"
          />
        )}

        <div className="grid grid-cols-1 gap-4 bg-gray-100 mb-2 p-4 rounded-lg shadow">
          <DetailRow
            icon={FaRulerCombined}
            label="Dimensions"
            value={`${block.width ?? "N/A"} x ${block.height ?? "N/A"} x ${
              block.depth ?? "N/A"
            }`}
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

      <div className="flex flex-row gap-2   ">
        <label className=" justify-center self-center  text-sm font-medium text-gray-700">
          Tags
        </label>

        <div className="flex flex-wrap gap-2 ">
          {block.tags.length === 0 && (
            <p className="text-gray-500 text-sm">No tags</p>
          )}
          {block.tags.map((tag) => (
            <div
              key={tag._id}
              className="flex items-center px-3 py-1 border rounded text-sm"
              style={{ backgroundColor: tag.color, color: "#fff" }}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
        <FaClock className="mr-2" /> Created on{" "}
        <strong>
          {block.createdAt
            ? new Date(block.createdAt).toLocaleDateString()
            : "Unknown"}
        </strong>
        by <strong>{block.addedBy?.username ?? "Unknown"}</strong>, last updated
        on{" "}
        <strong>
          {block.lastUpdate
            ? new Date(block.lastUpdate).toLocaleString()
            : "Unknown"}
        </strong>
        .
      </p>

      <NotesSection blocId={block._id} />

      {isBlockModalOpen && (
        <BlockModal
          show={isBlockModalOpen}
          onHide={() => setIsBlockModalOpen(false)}
          blockId={selectedBlockId}
        />
      )}
    </>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <p className="flex gap-2 items-center text-gray-700 bg-white p-3 rounded-lg shadow-sm">
    <Icon className="mr-2 text-blue-500" />
    <strong>{label}:</strong> {value}
  </p>
);

export default BlockInfoTab;
