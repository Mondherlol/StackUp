"use client";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getBackendImageUrl } from "@/utils/imageUrl";
import CreateBlockModal from "../CreateBlockModal";
import BlockModal from "./BlockModal/BlockModal";
import axiosInstance from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import EditBlockModal from "../EditBlockModal";

const WarehouseView = ({ warehouse }) => {
  const [blocks, setBlocks] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const [createBlocModalOpen, setCreateBlocModalOpen] = useState(false);
  const [editBlockModalOpen, setEditBlockModalOpen] = useState(false);
  const imageSrc = warehouse.planImage
    ? getBackendImageUrl(warehouse.planImage)
    : null;
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setBackgroundImage(img);
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!warehouse) return;
    setBlocks(warehouse.blocs);
  }, [warehouse]);

  const onCreateBlock = (bloc) => {
    if (bloc.parent) return; // We only add the block if it's a root block

    setBlocks([...blocks, bloc]);
  };

  const onEditBlock = (bloc) => {
    const newBlocks = blocks.map((b) =>
      b._id === bloc._id ? { ...b, ...bloc } : b
    );
    setBlocks(newBlocks);
  };

  const handleZoom = (factor) => {
    const newScale = Math.min(Math.max(scale * factor, 0.5), 3);
    setScale(newScale);
  };

  const handleViewBlock = (block) => {
    setSelectedBlock(block);
    setShowBlockModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBlock(null);
    setShowBlockModal(false);
  };

  const updateBlockPosition = async (blockId, newPosition) => {
    try {
      await axiosInstance.put(`/bloc/${blockId}/move`, {
        position: newPosition,
      });
    } catch (error) {
      toast.error("An error occurred while updating the block position.");
      console.error("Error updating block position:", error);
    }
  };

  const handleContextMenu = (e, block) => {
    e.evt.preventDefault();
    setContextMenu({
      x: e.evt.clientX,
      y: e.evt.clientY,
    });
    setSelectedBlock(block);
  };

  useEffect(() => {
    console.log("Updated selected block :", selectedBlock);
  }, [selectedBlock]);

  const handleContextMenuClick = (action) => {
    if (selectedBlock) {
      switch (action) {
        case "View":
          // Handle View action
          console.log("View block:", selectedBlock);
          handleViewBlock(selectedBlock);
          break;
        case "Edit":
          // Handle Edit action
          console.log("Edit block:", selectedBlock);
          setEditBlockModalOpen(true);
          break;
        case "AppendBlock":
          // Handle append block action
          console.log("Append block:", selectedBlock);
          setCreateBlocModalOpen(true);
          break;
        case "Delete":
          // Handle Delete action
          deleteBlock(selectedBlock._id);
          setSelectedBlock(null);
          break;
        default:
          break;
      }
    }
    setContextMenu(null);
  };

  const deleteBlock = async (blockId) => {
    try {
      await axiosInstance.delete(`/bloc/${blockId}`);
      setBlocks(blocks.filter((block) => block._id !== blockId));
      toast.success("Block deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the block.");
      console.error("Error deleting block:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest(".context-menu")) {
        setContextMenu(null);
        setSelectedBlock(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <>
      <div className="w-full h-[80vh] relative border border-gray-300 bg-gray-100">
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
            {backgroundImage && (
              <Image
                image={backgroundImage}
                x={0}
                y={0}
                width={1200}
                height={720}
              />
            )}
            {blocks.map((block) => (
              <Rect
                key={block._id}
                x={block.position.x}
                y={block.position.y}
                width={block.width}
                height={block.depth}
                fill={
                  block === selectedBlock
                    ? "rgba(255, 0, 0, 0.6)"
                    : "rgba(0, 123, 255, 0.6)"
                }
                draggable
                onDragEnd={(e) => {
                  const newBlocks = blocks.map((b) =>
                    b._id === block._id
                      ? {
                          ...b,
                          position: {
                            x: e.target.x(),
                            y: e.target.y(),
                          },
                        }
                      : b
                  );
                  setBlocks(newBlocks);
                  updateBlockPosition(block._id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
                onContextMenu={(e) => handleContextMenu(e, block)}
              />
            ))}
          </Layer>
        </Stage>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md flex space-x-3">
          <button
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => handleZoom(1.1)}
          >
            <FaPlus />
          </button>
          <button
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => handleZoom(0.9)}
          >
            <FaMinus />
          </button>
          <button
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
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
          parent={selectedBlock}
        />

        {editBlockModalOpen && (
          <EditBlockModal
            isOpen={editBlockModalOpen}
            onClose={() => setEditBlockModalOpen(false)}
            onEdit={onEditBlock}
            block={selectedBlock}
          />
        )}
      </div>
      {contextMenu && (
        <div
          className="absolute bg-white border rounded shadow-md context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleContextMenuClick("View")}
            >
              View
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleContextMenuClick("AppendBlock")}
            >
              Append block
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleContextMenuClick("Edit")}
            >
              Edit
            </li>

            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleContextMenuClick("Delete")}
            >
              Delete
            </li>
          </ul>
        </div>
      )}

      <BlockModal
        blockId={selectedBlock?._id}
        show={showBlockModal}
        onHide={handleCloseModal}
      />
    </>
  );
};

export default WarehouseView;
