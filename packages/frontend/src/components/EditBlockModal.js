import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";
import { getBackendImageUrl } from "@/utils/imageUrl";

const EditBlockModal = ({ isOpen, onClose, onEdit, block, parent }) => {
  const [formData, setFormData] = useState({
    name: block.name,
    picture: "",
    height: block.height,
    width: block.width,
    depth: block.depth,
    weight: block.weight ? block.weight : "",
    maxWeight: block.maxWeight ? block.maxWeight : "",
    tags: block.tags ? block.tags : [],
  });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [isOpen]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      parent: parent ? parent._id : null,
    }));
  }, [parent]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;

    // Validation to ensure values do not exceed parent values
    if (parent) {
      if (
        name === "height" &&
        parent.height &&
        parseFloat(newValue) > parent.height
      ) {
        toast.error(`Height cannot exceed ${parent.height} cm`);
        return;
      }
      if (
        name === "width" &&
        parent.width &&
        parseFloat(newValue) > parent.width
      ) {
        toast.error(`Width cannot exceed ${parent.width} cm`);
        return;
      }
      if (
        name === "depth" &&
        parent.depth &&
        parseFloat(newValue) > parent.depth
      ) {
        toast.error(`Depth cannot exceed ${parent.depth} cm`);
        return;
      }
      if (
        name === "weight" &&
        parent.maxWeight &&
        parseFloat(newValue) > parent.maxWeight
      ) {
        toast.error(`Weight cannot exceed ${parent.maxWeight} kg`);
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get(`/tag/${block.warehouse}`);
      setTags(response.data);

      if (block.tags) {
        console.log("tags response", response.data);
        console.log("block.tags", block.tags);
        // Set selected tags
        const v_selectedTags = block.tags.map((block_tag) =>
          response.data.find((tag) => tag._id === block_tag._id)
        );
        console.log("v_selectedTags", v_selectedTags);
        setSelectedTags(v_selectedTags);

        // Remove selected tags from tags list
        setTags((prevTags) =>
          prevTags.filter((tag) => !v_selectedTags.includes(tag))
        );
      }
    } catch (error) {
      console.log("Error fetching tags: ", error);
      toast.error(
        error.response?.data?.message || "An error occurred fetching tags."
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags
        : [...prevSelectedTags, tag]
    );
    setSearchQuery("");
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.filter((t) => t !== tag)
    );
    setTags((prevTags) => [
      ...prevTags.filter((t) => !selectedTags.includes(t)).concat(tag),
    ]);
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.width || !formData.height || !formData.depth) {
        toast.error("Please enter all dimensions");
        return;
      }

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        // Check if the value is null or undefined before adding it
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      selectedTags.forEach((tag) => {
        formDataToSend.append("tags", tag._id);
      });

      const response = await axiosInstance.put(
        `/bloc/${block._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated block:", response.data.bloc);
      onEdit(response.data.bloc);
      onClose();
      toast.success("Block updated successfully");
    } catch (error) {
      console.error("Error updating block:", error);
      toast.error("Error updating block.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-1">
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
          <div className="flex items-center space-x-2 mb-2">
            {(formData.picture || block.picture) && (
              <img
                src={
                  formData.picture
                    ? URL.createObjectURL(formData.picture)
                    : getBackendImageUrl(block.picture)
                }
                alt="Block"
                className="w-full h-40 object-cover mb-2"
              />
            )}

            <input
              className="w-full p-2 border rounded"
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Dimensions (cm)
          </label>
          <div className="flex space-x-2">
            <div className="w-1/3">
              <div className="flex-col items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Height
                </label>
                <input
                  className="w-full p-2 border rounded"
                  name="height"
                  type="number"
                  placeholder="Height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
                {parent && parent.height && (
                  <span className="text-xs text-gray-500">
                    Max: {parent.height} cm
                  </span>
                )}
              </div>
            </div>
            <div className="w-1/3">
              <div className="flex-col items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Width
                </label>
                <input
                  className="w-full p-2 border rounded"
                  name="width"
                  type="number"
                  placeholder="Width"
                  value={formData.width}
                  onChange={handleChange}
                  required
                />
                {parent && parent.width && (
                  <span className="text-xs text-gray-500">
                    Max: {parent.width} cm
                  </span>
                )}
              </div>
            </div>
            <div className="w-1/3">
              <div className="flex-col items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Depth
                </label>
                <input
                  className="w-full p-2 border rounded"
                  name="depth"
                  type="number"
                  placeholder="Depth"
                  value={formData.depth}
                  onChange={handleChange}
                />
              </div>
              {parent && parent.depth && (
                <span className="text-xs text-gray-500">
                  Max: {parent.depth} cm
                </span>
              )}
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <div>
            <input
              className="w-full p-2 border rounded"
              name="weight"
              type="number"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={handleChange}
            />
            {parent && parent.maxWeight && (
              <span className="text-xs text-gray-500">
                Max: {parent.maxWeight} kg
              </span>
            )}
          </div>

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

          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="relative">
            <input
              className="w-full p-2 border rounded mb-2"
              type="text"
              placeholder="Search for tags"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            />
            {isDropdownOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <li
                    key={tag._id}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <div
                key={tag._id}
                className="flex items-center px-3 py-1 border rounded text-sm"
                style={{ backgroundColor: tag.color, color: "#fff" }}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlockModal;
