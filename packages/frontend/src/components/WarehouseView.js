"use client";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getBackendImageUrl } from "@/utils/imageUrl";
import CreateBlockModal from "./CreateBlocModal";

const WarehouseView = ({ warehouse }) => {
  const [blocks, setBlocks] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const [createBlocModalOpen, setCreateBlocModalOpen] = useState(false);

  const imageSrc = warehouse.planImage
    ? getBackendImageUrl(warehouse.planImage)
    : null;
  // const [backgroundImage] = useImage(imageSrc);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setBackgroundImage(img);
    };
  }, []);

  const onCreateBlock = (bloc) => {
    console.log("Creating block with data:", bloc);
    const newBlock = {
      id: Date.now(),
      x: bloc.position.x ? bloc.position.x : Math.random() * 300,
      y: bloc.position.y ? bloc.position.y : Math.random() * 300,
      width: bloc.width ? bloc.width : 100,
      height: bloc.height ? bloc.height : 100,
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
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.8}
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
          {/* Image d'arrière-plan */}
          {backgroundImage && (
            <Image
              image={backgroundImage}
              x={0}
              y={0}
              width={1200}
              height={720}
            />
          )}

          {/* Blocs interactifs */}
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
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md flex space-x-3">
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
        <button
          className="p-2 bg-gray-100 rounded"
          onClick={() => setCreateBlocModalOpen(true)}
        >
          ➕ Add a block
        </button>
      </div>

      <CreateBlockModal
        isOpen={createBlocModalOpen}
        onClose={() => setCreateBlocModalOpen(false)}
        onCreate={onCreateBlock}
        warehouse={warehouse}
      />
    </div>
  );
};

export default WarehouseView;
