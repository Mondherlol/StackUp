import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import BlockModal from "../WarehouseView/BlockModal/BlockModal";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosConfig";

const colors = [
  "#f4a261",
  "#2a9d8f",
  "#e76f51",
  "#264653",
  "#8d99ae",
  "#e63946",
  "#6a0572",
  "#457b9d",
];

const Treemap = ({
  width,
  height,
  data,
  handleOnClick,
  rootColor,
  distributionMode,
  onEdit,
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this block?")) {
      try {
        await axiosInstance.delete(`/bloc/${id}`);
        toast.success("Block deleted successfully");
        await onEdit();
      } catch (error) {
        toast.error("An error occurred while deleting the block.");
        console.error("Error deleting block:", error);
      }
    }
  };

  const hierarchy = useMemo(
    () => d3.hierarchy(data).sum((d) => Math.log1p(d.value)), // Log pour éviter les gros écarts
    [data]
  );

  // Définir la couleur du root et les couleurs des enfants
  const colorScale = d3
    .scaleOrdinal()
    .domain(hierarchy.children?.map((c) => c.data.name) || [])
    .range(colors);

  const root = useMemo(
    () =>
      d3.treemap().size([width, height]).padding(6).round(true)(
        // Ajout pour éviter des valeurs trop petites
        hierarchy
      ),
    [hierarchy, width, height]
  );

  return (
    <>
      <svg
        width={width}
        height={height}
        className="border rounded-lg shadow-lg"
      >
        {root.leaves().map((leaf, i) => {
          const { name, _id, value, nb_blocks } = leaf.data;
          const fillColor = rootColor || colorScale(name); // Utilise rootColor si fourni

          return (
            <g
              key={i}
              onClick={() => _id && handleOnClick(leaf.data, fillColor)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  data: leaf.data,
                  color: fillColor,
                });
              }}
              className="cursor-pointer"
            >
              <rect
                x={leaf.x0}
                y={leaf.y0}
                width={leaf.x1 - leaf.x0}
                height={leaf.y1 - leaf.y0}
                stroke="black"
                strokeWidth={2}
                fill={fillColor}
                className="opacity-90 hover:opacity-100 transition-all duration-200"
              />
              {leaf.x1 - leaf.x0 > 60 && leaf.y1 - leaf.y0 > 35 && (
                <>
                  <text
                    x={leaf.x0 + 6}
                    y={leaf.y0 + 18}
                    fontSize={14}
                    fill="white"
                    fontWeight="bold"
                  >
                    {name}
                  </text>
                  <text
                    x={leaf.x0 + 6}
                    y={leaf.y0 + 34}
                    fontSize={12}
                    fill="white"
                  >
                    {nb_blocks || 0} blocs
                  </text>
                  <text
                    x={leaf.x0 + 6}
                    y={leaf.y0 + 50}
                    fontSize={12}
                    fill="white"
                  >
                    {distributionMode != "volume" && `${value} cm`}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-300 shadow-lg rounded-md z-50"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <button
            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
            onClick={() => {
              setIsBlockModalOpen(true);
              setSelectedBlock(contextMenu.data);
              setContextMenu(null);
            }}
          >
            Open Details
          </button>
          <button
            className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
            onClick={() => {
              handleDelete(contextMenu.data._id);
              setContextMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
      {isBlockModalOpen && (
        <BlockModal
          show={isBlockModalOpen}
          onHide={() => setIsBlockModalOpen(false)}
          blockId={selectedBlock?._id}
        />
      )}
    </>
  );
};

export default Treemap;
