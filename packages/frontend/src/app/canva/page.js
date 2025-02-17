"use client";
import React, { useState, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { FaPlus, FaMinus } from "react-icons/fa";

const Canvas = ({
  width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  // Ajouter un bloc
  const addBlock = () => {
    const newBlock = {
      id: Date.now(),
      x: Math.random() * 300,
      y: Math.random() * 300,
      width: 100,
      height: 100,
    };
    setBlocks([...blocks, newBlock]);
  };

  // Zoom
  const handleZoom = (factor) => {
    const newScale = Math.min(Math.max(scale * factor, 0.5), 3);
    setScale(newScale);
  };

  return (
    <div className="w-full h-[80vh] relative border border-gray-300 bg-gray-100">
      {/* Stage Konva */}
      <Stage
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        ref={stageRef}
        onWheel={(e) => {
          e.evt.preventDefault();
          handleZoom(e.evt.deltaY > 0 ? 0.9 : 1.1);
        }}
      >
        <Layer>
          {/* Quadrillage */}
          {Array.from({ length: 80 }, (_, i) => (
            <Rect
              key={i}
              x={(i % 10) * 100}
              y={Math.floor(i / 10) * 100}
              width={100}
              height={100}
              fill="transparent"
              stroke="#ddd"
              strokeWidth={1}
            />
          ))}

          {/* Blocs */}
          {blocks.map((block) => (
            <Rect
              key={block.id}
              x={block.x}
              y={block.y}
              width={block.width}
              height={block.height}
              fill="rgba(0, 123, 255, 0.6)"
              draggable
              onDragEnd={(e) => {
                const newBlocks = blocks.map((b) =>
                  b.id === block.id
                    ? { ...b, x: e.target.x(), y: e.target.y() }
                    : b
                );
                setBlocks(newBlocks);
              }}
            />
          ))}
        </Layer>
      </Stage>

      {/* Boutons de contrôle */}
      <div className="absolute bottom-5 left-5 flex gap-3 bg-white p-2 rounded-lg shadow-md">
        <button
          className="p-2 bg-gray-100 rounded"
          onClick={() => handleZoom(1.1)}
        >
          <FaPlus />
        </button>
        <button
          className="p-2 bg-gray-100 rounded"
          onClick={() => handleZoom(0.9)}
        >
          <FaMinus />
        </button>
        <button className="p-2 bg-gray-100 rounded" onClick={addBlock}>
          ➕ Ajouter un bloc
        </button>
      </div>
    </div>
  );
};

export default Canvas;
