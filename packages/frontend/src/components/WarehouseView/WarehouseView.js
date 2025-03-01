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
import BlockLayer from "./BlockLayer";

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
  const [copiedBlock, setCopiedBlock] = useState(null);

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
    console.log("Blocks in warehouse :", warehouse.blocs);
  }, [warehouse]);

  useEffect(() => {
    console.log("Blocks Updated :", blocks);
  }, [blocks]);

  const onCreateBlock = (blocs) => {
    if (blocs[0].parent) return; // We only add the block if it's a root block

    setBlocks([...blocks, ...blocs]);
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
      setBlocks(blocks.map((b) => ({ ...b, isCut: false }))); // Reset "cut" state
      setCopiedBlock(null);
      switch (action) {
        case "View":
          handleViewBlock(selectedBlock);
          break;
        case "Cut":
          setCopiedBlock(selectedBlock);
          setBlocks(
            blocks.map((b) =>
              b._id === selectedBlock._id
                ? { ...b, isCut: true }
                : { ...b, isCut: false }
            )
          );
          break;
        case "Paste":
          handleSetParent(copiedBlock._id, selectedBlock._id);
          break;
        case "Edit":
          setEditBlockModalOpen(true);
          break;
        case "AppendBlock":
          setCreateBlocModalOpen(true);
          break;
        case "Delete":
          deleteBlock(selectedBlock._id);
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

  const handleSetParent = async (blockId, parentId) => {
    try {
      await axiosInstance.put(`/bloc/${blockId}/parent/${parentId}`);
      const newBlocks = blocks.map((b) =>
        b._id === blockId ? { ...b, parent: parentId } : b
      );
      setBlocks(newBlocks);
      setCopiedBlock(null);
      toast.success("Block moved successfully");
    } catch (error) {
      toast.error("An error occurred while moving the block.");
      console.error("Error moving block:", error);
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
          <BlockLayer
            blocks={blocks}
            backgroundImage={backgroundImage}
            selectedBlock={selectedBlock}
            setBlocks={setBlocks}
            updateBlockPosition={updateBlockPosition}
            handleContextMenu={handleContextMenu}
          />
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
            onClick={() => {
              setSelectedBlock(null);
              setCreateBlocModalOpen(true);
            }}
          >
            ➕ Add block(s)
          </button>
        </div>
        <CreateBlockModal
          isOpen={createBlocModalOpen}
          onClose={() => setCreateBlocModalOpen(false)}
          onCreate={onCreateBlock}
          warehouseId={warehouse._id}
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
              onClick={() => handleContextMenuClick("Cut")}
            >
              Cut
            </li>
            {copiedBlock && selectedBlock._id != copiedBlock._id && (
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleContextMenuClick("Paste")}
              >
                Paste
              </li>
            )}
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
