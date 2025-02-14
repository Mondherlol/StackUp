"use client";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";

const AddWarehouse = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    maxCapacity: "",
    maxWeight: "",
    width: "",
    height: "",
    depth: "",
    planImage: null,
    description: "",
  });

  const [showAddress, setShowAddress] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "name") {
      setCanSubmit(value.length > 0);
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      planImage: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axiosInstance.post("/warehouse", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      toast.success("Warehouse created successfully");

      router.push("/warehouses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Warehouse creation failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <Link href="/warehouses" className="mb-4 text-blue-500 hover:underline">
        &larr; Back
      </Link>
      <h2 className="text-2xl font-bold mb-6">Add Warehouse</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name your warehouse"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="showAddress"
            checked={showAddress}
            onChange={() => setShowAddress(!showAddress)}
            className="mr-2"
          />
          <label htmlFor="showAddress" className="text-gray-700">
            Provide Address
          </label>
        </div>
        {showAddress && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="1234 Main St"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Example City"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Max Weight (Optional)</label>
          <input
            type="number"
            name="maxWeight"
            value={formData.maxWeight}
            onChange={handleChange}
            placeholder="In Kg"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Width</label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              placeholder="meter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Height</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="meter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Depth</label>
            <input
              type="number"
              name="depth"
              value={formData.depth}
              onChange={handleChange}
              placeholder="meter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Warehouse Plan (Optional)
          </label>
          <input
            type="file"
            name="planImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additionnal informations if needed"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Add Warehouse
        </button>
      </form>
    </div>
  );
};

export default AddWarehouse;
