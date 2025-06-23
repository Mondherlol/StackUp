"use client";
import React, { useState, useEffect } from "react";
import { X, Search, CheckSquare, Square, Move, Trash2 } from "lucide-react";
import axiosInstance from "@/utils/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import MassEditActions from "./MassEditActions";

const BatchActionModal = ({ isOpen, onClose, fetchWarehouse, warehouseId }) => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isSelectingParent, setIsSelectingParent] = useState(false);
  const [newParentId, setNewParentId] = useState(null);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) handleSearch();
  }, [isOpen]);

  const fetchSelectedBlocks = async () => {
    try {
      const response = await axiosInstance.post(`/bloc/get-batch`, {
        blocIds: selectedBlocks.map((block) => block._id),
      });

      console.log("Fetched selected blocks", response.data);

      setSelectedBlocks(response.data);
    } catch (err) {
      console.log(err.message);
      toast.error("An error occurred while fetching the selected blocks.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(
        `/bloc/search/${warehouseId}?query=${query}`
      );
      setResults(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const toggleSelection = (id) => {
    setSelectedBlocks((prev) =>
      prev.map((block) => block._id).includes(id)
        ? prev.filter((block) => block._id !== id)
        : [...prev, results.find((block) => block._id === id)]
    );
  };

  const startMoveAction = () => {
    setShowMoveOptions(true);
  };

  const selectNewParent = (id) => {
    if (!selectedBlocks.includes(id)) {
      setNewParentId(id);
      setIsSelectingParent(false);
      handleBatchAction("move", id);
    }
  };

  const handleChangeParentsBatch = async (newParentId) => {
    try {
      await axiosInstance.put("/bloc/batch/parent", {
        blocIds: selectedBlocks,
        newParentId,
      });
      toast.success("The blocks were successfully moved.");
      await fetchWarehouse();
    } catch (err) {
      console.error(err.message);
      toast.error("An error occurred when moving the blocks.");
    }
  };

  const deleteBlock = async (blockId) => {
    try {
      await axiosInstance.delete(`/bloc/${blockId}`);
    } catch (error) {
      toast.error("An error occurred while deleting the block : " + blockId);
      console.error("Error deleting block:", error);
    }
  };

  const handleDeleteBlocks = async () => {
    try {
      setIsDeleting(true);

      for (const block of selectedBlocks) {
        const blockId = block._id;
        await deleteBlock(blockId);
        setSelectedBlocks((prev) =>
          prev.filter((block) => block._id !== blockId)
        );
      }

      toast.success("All selected blocks have been deleted successfully.");

      setIsDeleting(false);
      await fetchWarehouse();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleBatchAction = async (action, parentId = null) => {
    try {
      if (selectedBlocks.length > 0) {
        if (action === "delete" && !confirm("Confirm the deleting ?")) return;

        if (action === "delete") {
          await handleDeleteBlocks();
        }

        if (action === "move") {
          console.log("Moving blocks", selectedBlocks, "to", parentId);
          await handleChangeParentsBatch(parentId);
        }

        if (action === "edit") {
          setIsEditing(true);
          return;
        }
        setSelectedBlocks([]);
        setNewParentId(null);
        onClose();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const removeFromSelection = (id) => {
    setSelectedBlocks((prev) => prev.filter((block) => block._id !== id));

    if (selectedBlocks.length === 1) {
      setIsSelectingParent(false);
      setIsEditing(false);
    }
  };

  const handleMoveToRoot = () => {
    console.log("Move to root");
    handleBatchAction("move", null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white w-[90%] max-w-5xl h-[80%] flex rounded-2xl shadow-xl overflow-hidden relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            <div className="w-2/3 p-6 border-r">
              {isEditing ? (
                <MassEditActions
                  selectedItems={selectedBlocks}
                  onUpdate={async () => {
                    await fetchWarehouse();
                    await fetchSelectedBlocks();
                    await handleSearch();
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    {isSelectingParent
                      ? "Select a destination"
                      : "Select some blocks"}
                  </h2>
                  <div className="relative mb-4">
                    <Search
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-white shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </form>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto space-y-3">
                    {results.length > 0 ? (
                      results.map((bloc) => (
                        <div
                          key={bloc._id}
                          className={`p-3 rounded-lg shadow flex items-center gap-4 cursor-pointer 
                                                                                                ${
                                                                                                  isSelectingParent &&
                                                                                                  selectedBlocks.some(
                                                                                                    (
                                                                                                      selectedBlock
                                                                                                    ) =>
                                                                                                      selectedBlock._id ==
                                                                                                      bloc._id
                                                                                                  )
                                                                                                    ? "opacity-50 cursor-not-allowed"
                                                                                                    : "bg-gray-50 hover:bg-gray-100"
                                                                                                } 
                                                                                                  )
                                                                                                    
                                                                                                }`}
                          onClick={() =>
                            isSelectingParent
                              ? selectNewParent(bloc._id)
                              : toggleSelection(bloc._id)
                          }
                        >
                          {!isSelectingParent && (
                            <button onClick={() => toggleSelection(bloc._id)}>
                              {selectedBlocks.some(
                                (selectedBlock) =>
                                  selectedBlock._id === bloc._id
                              ) ? (
                                <CheckSquare
                                  size={20}
                                  className="text-blue-500"
                                />
                              ) : (
                                <Square size={20} className="text-gray-400" />
                              )}
                            </button>
                          )}
                          <div className="flex flex-row  gap-4">
                            <div>
                              <h3 className="font-semibold">
                                {bloc.name}
                                <span className="text-gray-500 text-sm ml-2">
                                  inside
                                  {bloc.parent
                                    ? " " + bloc.parent.name
                                    : " root"}
                                </span>
                              </h3>
                              <p className="text-sm text-gray-500">
                                {bloc.blocs.length
                                  ? `${bloc.blocs.length} blocs`
                                  : "Vide"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">
                        Aucun résultat trouvé.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="w-1/3 p-6 flex flex-col justify-between">
              <h2 className="text-lg font-semibold mb-4">Selected blocks</h2>
              <ul className="text-gray-600 text-sm space-y-2 overflow-scroll max-h-[60vh]">
                {selectedBlocks.map((block) => {
                  return (
                    <div
                      key={block._id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow"
                    >
                      <span className="text-sm font-medium">
                        {block?.name || "Bloc inconnu"}
                      </span>
                      <button
                        onClick={() => removeFromSelection(block._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </ul>
              {isDeleting && (
                <div className="flex items-center justify-center gap-2 mt-4 ">
                  <p>Delete in progress...</p>
                </div>
              )}
              {!isDeleting && selectedBlocks.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  {isSelectingParent || isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsSelectingParent(false);
                          setIsEditing(false);
                        }}
                        style={{ border: "1px solid #ccc" }}
                        className=" hover:scale-105 duration-75  border-solid text-red-500 flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={startMoveAction}
                        className="bg-blue-500 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                      >
                        <Move size={16} /> Change parent
                      </button>
                      <button
                        onClick={() => handleBatchAction("edit")}
                        className="bg-blue-500 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                      >
                        <MdEdit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleBatchAction("delete")}
                        className="bg-red-500 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {showMoveOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">Déplacer vers</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowMoveOptions(false);
                      setIsSelectingParent(true);
                    }}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                  >
                    Déplacer vers un bloc
                  </button>
                  <button
                    onClick={() => {
                      setShowMoveOptions(false);
                      handleMoveToRoot();
                    }}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg"
                  >
                    Déplacer vers la racine
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BatchActionModal;
