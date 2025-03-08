import { useState } from "react";
import {
  FiArrowLeft,
  FiTag,
  FiEdit,
  FiImage,
  FiMaximize,
} from "react-icons/fi";
import EditName from "./EditName";
import EditDimensions from "./EditDimensions";

const MassEditActions = ({ selectedItems, onCancel, onUpdate }) => {
  const [activeAction, setActiveAction] = useState(null);

  const handleSave = async () => {
    if (activeAction && actions[activeAction].onSave) {
      console.log("HANDLE SAVE ");
      await actions[activeAction].onSave();
      setActiveAction(null);
      await onUpdate();
    }
  };

  const actions = {
    tags: {
      label: "Modifier les tags",
      icon: <FiTag className="mr-2" />,
      component: (
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-1">
            Nouveaux tags
          </label>
          <input
            type="text"
            placeholder="Entrez des tags"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ),
    },
    name: {
      label: "Modifier le nom",
      icon: <FiEdit className="mr-2" />,
      component: <EditName batch={selectedItems} onSave={handleSave} />,
      onSave: () => document.getElementById("save-edit-name")?.click(),
    },
    dimensions: {
      label: "Modifier les dimensions",
      icon: <FiMaximize className="mr-2" />,
      component: <EditDimensions batch={selectedItems} onSave={handleSave} />,
      onSave: () => document.getElementById("save-edit-dimensions")?.click(),
    },
    picture: {
      label: "Modifier l’image",
      icon: <FiImage className="mr-2" />,
      component: (
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-1">
            Nouvelle image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>
      ),
    },
  };

  const handleActionClick = (actionKey) => {
    setActiveAction(actionKey);
  };

  const handleCancel = () => {
    if (!activeAction) {
      onCancel();
    }
    setActiveAction(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto  ">
      {/* Bouton de retour en haut à gauche */}

      <button
        onClick={handleCancel}
        className="flex items-center  text-gray-600 hover:text-gray-800 transition-colors mb-4"
      >
        <FiArrowLeft className="mr-2" />
        Cancel
      </button>

      {activeAction ? (
        <div className="space-y-4">
          {actions[activeAction].component}
          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="w-1/2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-1/2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {Object.entries(actions).map(([key, action]) => (
            <button
              key={key}
              onClick={() => handleActionClick(key)}
              className="flex items-center justify-center px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg hover:bg-gray-200 transition-colors"
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      )}
      {selectedItems ? (
        <p className="text-sm text-gray-500 mt-4">
          {selectedItems.length} items selected
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-4">No item selected</p>
      )}
    </div>
  );
};

export default MassEditActions;
