import React from "react";
import BlockVisualizer from "./BlockVisualizer";

const BlockVisualizerModal = ({ rootBlockId, warehouse, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh] w-[650px] h-[550px] flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Block Visualization</h2>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <BlockVisualizer rootBlockId={rootBlockId} warehouse={warehouse} />
      </div>
    </div>
  );
};

export default BlockVisualizerModal;
