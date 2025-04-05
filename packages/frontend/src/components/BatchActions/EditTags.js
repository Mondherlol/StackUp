import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosConfig";

const EditTags = ({ batch, onSave }) => {
  const [allTags, setAllTags] = useState([]); // Tous les tags dispo
  const [selectedTags, setSelectedTags] = useState([]); // Tags choisis
  const [inputValue, setInputValue] = useState(""); // Valeur du champ de saisie
  const [suggestions, setSuggestions] = useState([]); // Suggestions filtrées
  const [removeOtherTags, setRemoveOtherTags] = useState(false);

  const warehouseId = batch?.[0]?.warehouse;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get(`/tag/${warehouseId}`);
        setAllTags(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tags :", error);
        toast.error("Impossible de charger les tags.");
      }
    };

    if (warehouseId) {
      fetchTags();
    }
  }, [warehouseId]);

  useEffect(() => {
    const filtered = allTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.find((t) => t._id === tag._id)
    );
    setSuggestions(filtered);
  }, [inputValue, allTags, selectedTags]);

  const handleSelectTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue("");
    setSuggestions([]);
  };

  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter((tag) => tag._id !== tagId));
  };

  const handleEditTags = async () => {
    if (selectedTags.length === 0) {
      toast.error("Veuillez sélectionner au moins un tag.");
      return;
    }

    try {
      const response = await axiosInstance.put("/bloc/batch/tags", {
        blocIds: batch.map((item) => item._id),
        tags: selectedTags.map((tag) => tag._id),
        removeOtherTags,
      });

      if (response.status === 200) {
        toast.success("Tags mis à jour avec succès.");
        onSave();
      } else {
        toast.error("Erreur lors de la mise à jour des tags.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur inattendue.");
    }
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <h2 className="text-gray-800 text-lg font-semibold mb-4">
        Mettre à jour les tags
      </h2>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <span
              key={tag._id}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
            >
              {tag.name}
              <button
                onClick={() => handleRemoveTag(tag._id)}
                className="ml-2 text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Rechercher des tags..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {suggestions.length > 0 && (
          <ul className="border rounded-md mt-1 max-h-40 overflow-y-auto bg-white shadow">
            {suggestions.map((tag) => (
              <li
                key={tag._id}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelectTag(tag)}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="remove-other-tags"
            checked={removeOtherTags}
            onChange={(e) => setRemoveOtherTags(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="remove-other-tags" className="text-sm text-gray-700">
            Remove any other tags
          </label>
        </div>
      </div>

      <button id="save-edit-tags" onClick={handleEditTags} className="hidden">
        Enregistrer
      </button>
    </div>
  );
};

export default EditTags;
