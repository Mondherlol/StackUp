"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const TagsManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [tags, setTags] = useState({});
  const [newTag, setNewTag] = useState({
    name: "",
    color: getRandomColor(),
    warehouseId: "",
  });

  const [editTag, setEditTag] = useState(null);
  const [updatedTag, setUpdatedTag] = useState({ name: "", color: "" });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axiosInstance.get("/warehouse");
      const fetchedWarehouses = response.data.warehouses;
      setWarehouses(fetchedWarehouses);

      // Préremplir warehouseId seulement s'il n'est pas encore défini
      if (fetchedWarehouses.length === 1 && !newTag.warehouseId) {
        setNewTag((prev) => ({
          ...prev,
          warehouseId: fetchedWarehouses[0]._id,
        }));
      }

      fetchedWarehouses.forEach((warehouse) => fetchTags(warehouse._id));
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const fetchTags = async (warehouseId) => {
    try {
      const response = await axiosInstance.get(`/tag/${warehouseId}`);
      setTags((prev) => ({ ...prev, [warehouseId]: response.data }));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const addTag = async () => {
    if (!newTag.name || !newTag.warehouseId) {
      return toast.error("Name and Warehouse are required");
    }
    try {
      await axiosInstance.post(`/tag/${newTag.warehouseId}`, newTag);
      toast.success("Tag added successfully");
      fetchTags(newTag.warehouseId);
      setNewTag((prev) => ({
        name: "",
        color: getRandomColor(),
        warehouseId: prev.warehouseId,
      }));
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error(error.response?.data?.message || "An error occured");
    }
  };

  const deleteTag = async (tagId, warehouseId) => {
    try {
      await axiosInstance.delete(`/tag/${tagId}`);
      toast.success("Tag deleted successfully");
      fetchTags(warehouseId);
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    }
  };

  const updateTag = async () => {
    if (!editTag) return;
    try {
      await axiosInstance.put(`/tag/${editTag._id}`, updatedTag);
      toast.success("Tag updated successfully");
      fetchTags(editTag.warehouse);
      setEditTag(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="mx-auto md:px-24 p-8 bg-gray-100  min-h-screen rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Manage Tags
      </h2>
      <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Tag Name"
          value={newTag.name}
          onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
          className="border p-2 rounded w-1/3 shadow-sm focus:ring focus:ring-blue-300"
        />
        <input
          type="color"
          value={newTag.color}
          onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
          className="w-12 h-10 border rounded cursor-pointer"
        />
        <select
          value={newTag.warehouseId}
          onChange={(e) =>
            setNewTag({ ...newTag, warehouseId: e.target.value })
          }
          className="border p-2 rounded w-1/3 shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((wh) => (
            <option key={wh._id} value={wh._id}>
              {wh.name}
            </option>
          ))}
        </select>
        <button
          onClick={addTag}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-md flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FaPlus /> Add
        </button>
      </div>
      {warehouses.map((warehouse) => (
        <div
          key={warehouse._id}
          className="mb-6 p-6 bg-white rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            {warehouse.name}
          </h3>
          <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags[warehouse._id]?.map((tag) => (
              <div
                key={tag._id}
                className="p-3 flex items-center justify-between rounded-lg shadow-md text-white font-semibold"
                style={{ backgroundColor: tag.color }}
              >
                <span>{tag.name}</span>
                <div className="flex gap-2">
                  <button
                    className="text-white hover:scale-125 transition"
                    onClick={() => {
                      setEditTag(tag);
                      setUpdatedTag({ name: tag.name, color: tag.color });
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteTag(tag._id, warehouse._id)}
                    className="text-white hover:scale-125 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {editTag && (
        <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Tag</h3>
            <input
              type="text"
              value={updatedTag.name}
              onChange={(e) =>
                setUpdatedTag({ ...updatedTag, name: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
              placeholder="Tag Name"
            />
            <input
              type="color"
              value={updatedTag.color}
              onChange={(e) =>
                setUpdatedTag({ ...updatedTag, color: e.target.value })
              }
              className="w-full h-10 border rounded cursor-pointer mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditTag(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateTag}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsManagement;
