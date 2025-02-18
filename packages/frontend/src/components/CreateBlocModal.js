import { useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";

const CreateBlockModal = ({ isOpen, onClose, onCreate, warehouse }) => {
  const [formData, setFormData] = useState({
    name: "",
    picture: null,
    height: "",
    width: "",
    depth: "",
    weight: "",
    capacity: "",
    maxWeight: "",
    warehouse: warehouse._id,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axiosInstance.post("/bloc", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      const bloc = response.data.bloc;

      console.log("Bloc : ", bloc);

      toast.success("Block added successfully");

      // Pass the created block to the parent component
      onCreate(bloc);
      onClose();
    } catch (error) {
      console.error("Error creating block:", error);
      toast.error("Error creating block.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Create a new Block</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Block Name
          </label>
          <input
            className="w-full p-2 border rounded"
            name="name"
            placeholder="Enter block name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            className="w-full p-2 border rounded"
            type="file"
            name="picture"
            accept="image/*"
            onChange={handleChange}
          />

          <label className="block text-sm font-medium text-gray-700">
            Dimensions (cm)
          </label>
          <div className="flex space-x-2">
            <input
              className="w-1/3 p-2 border rounded"
              name="height"
              type="number"
              placeholder="Height"
              value={formData.height}
              onChange={handleChange}
            />
            <input
              className="w-1/3 p-2 border rounded"
              name="width"
              type="number"
              placeholder="Width"
              value={formData.width}
              onChange={handleChange}
            />
            <input
              className="w-1/3 p-2 border rounded"
              name="depth"
              type="number"
              placeholder="Depth"
              value={formData.depth}
              onChange={handleChange}
            />
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            className="w-full p-2 border rounded"
            name="weight"
            type="number"
            placeholder="Enter weight"
            value={formData.weight}
            onChange={handleChange}
          />

          <label className="block text-sm font-medium text-gray-700">
            Capacity
          </label>
          <input
            className="w-full p-2 border rounded"
            name="capacity"
            type="number"
            placeholder="Enter capacity"
            value={formData.capacity}
            onChange={handleChange}
          />

          <label className="block text-sm font-medium text-gray-700">
            Max Weight (kg)
          </label>
          <input
            className="w-full p-2 border rounded"
            name="maxWeight"
            type="number"
            placeholder="Enter max weight"
            value={formData.maxWeight}
            onChange={handleChange}
          />

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded text-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlockModal;
