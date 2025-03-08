import axiosInstance from "@/utils/axiosConfig";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditName = ({ batch, onSave }) => {
  const [name, setName] = useState("");
  const [sameNameForAll, setSameNameForAll] = useState(false);

  useEffect(() => {
    console.log("Batch : ", batch);
  }, [batch]);

  const handleEditName = async () => {
    try {
      const blocIds = batch.map((b) => b._id);
      const response = await axiosInstance.put("/bloc/batch/name", {
        blocIds,
        name,
        sameNameForAll,
      });

      if (response.status === 200) {
        toast.success("Name updated successfully.");
        onSave();
      } else {
        toast.error("An error occurred while updating the name.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occured");
    }
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-1">New name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Enter a new name"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center space-x-2 mb-2 mt-2">
        <input
          type="checkbox"
          id="sameNameForAll"
          name="sameNameForAll"
          value={sameNameForAll}
          onChange={(e) => setSameNameForAll(e.target.checked)}
        />
        <label
          htmlFor="sameNameForAll"
          className="text-sm font-medium text-gray-700"
        >
          Use same name for all blocks
        </label>
      </div>
      <p className="text-sm text-gray-500">
        (If unchecked, each name will be followed by _1, _2, _3, etc.)
      </p>

      <button id="save-edit-name" onClick={handleEditName} className="hidden">
        Sauvegarder
      </button>
    </div>
  );
};

export default EditName;
