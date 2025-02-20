import React from "react";

const BlockModal = ({ block, show, onHide }) => {
  if (!show || !block) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-semibold">{block.name}</h2>
          <button
            onClick={onHide}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4 text-center">
          {block.picture && (
            <img
              src={block.picture}
              alt={block.name}
              className="mx-auto mb-4 rounded-lg shadow-md"
              style={{ maxWidth: "200px" }}
            />
          )}
          <p>
            <strong>Dimensions:</strong> {block.width} x {block.height} x{" "}
            {block.depth}
          </p>
          <p>
            <strong>Weight:</strong> {block.weight} kg
          </p>
          <p>
            <strong>Max Weight:</strong> {block.maxWeight} kg
          </p>
          <p>
            <strong>Added By:</strong> {block.addedBy}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(block.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Update:</strong>{" "}
            {new Date(block.lastUpdate).toLocaleString()}
          </p>
        </div>
        {block.blocs && block.blocs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Contained Blocks:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {block.blocs.map((childBlock) => (
                <BlockCard key={childBlock._id} block={childBlock} />
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BlockCard = ({ block }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      {block.picture && (
        <img
          src={block.picture}
          alt={block.name}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
      )}
      <h4 className="text-lg font-semibold">{block.name}</h4>
      <p>
        <strong>Dimensions:</strong> {block.width} x {block.height} x{" "}
        {block.depth}
      </p>
      <p>
        <strong>Weight:</strong> {block.weight} kg
      </p>
      <p>
        <strong>Max Weight:</strong> {block.maxWeight} kg
      </p>
    </div>
  );
};

export default BlockModal;
