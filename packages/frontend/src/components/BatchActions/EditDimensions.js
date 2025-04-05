import axiosInstance from "@/utils/axiosConfig";
import { Weight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const EditDimensions = ({ batch, onSave }) => {
  const [name, setName] = useState("");
  const [dimensions, setDimensions] = useState({
    width: "",
    height: "",
    depth: "",
    weight: "",
  });

  const handleEditDimensions = async () => {
    try {
      const blocIds = batch.map((b) => b._id);
      const response = await axiosInstance.put("/bloc/batch/dimensions", {
        blocIds,

        width: dimensions.width,
        height: dimensions.height,
        depth: dimensions.depth,
        weight: dimensions.weight,
      });

      if (response.status === 200) {
        toast.success("Dimensions mises à jour avec succès.");
        onSave();
      } else {
        toast.error("Une erreur est survenue lors de la mise à jour.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="w-full  bg-white rounded-lg">
      <h2 className="text-gray-800 text-lg font-semibold mb-4">
        Update dimensions
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Width (cm)", key: "width" },
          { label: "Height (cm)", key: "height" },
          { label: "Depth (cm)", key: "depth" },
        ].map(({ label, key }) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">{label}</label>
            <input
              type="number"
              placeholder={key}
              value={dimensions[key]}
              onChange={(e) =>
                setDimensions({ ...dimensions, [key]: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row  gap-4 w-full mt-4 justify-start items-center">
        <label className="text-gray-700 font-medium  justify-center ">
          Weight
        </label>
        <input
          type="number"
          placeholder="Weight"
          value={dimensions.weight}
          onChange={(e) =>
            setDimensions({ ...dimensions, weight: e.target.value })
          }
          className=" w-1/3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <label className="text-gray-700 font-medium  justify-center ">
          in Kilograms (kg)
        </label>
      </div>

      <button
        onClick={handleEditDimensions}
        id="save-edit-dimensions"
        className="hidden"
      >
        Enregistrer
      </button>

      <div className="mt-8">
        <h5 className="text-gray-700 text-md font-semibold mb-3">
          ...or select dimensions one of theses blocks :
        </h5>
        <div
          className="flex h-24 bg-red-50 flex-nowrap overflow-x-auto whitespace-nowrap pb-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {batch.map((bloc) => (
            <button
              key={bloc._id}
              className="flex-shrink-0 flex flex-col items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors mr-3"
              onClick={() =>
                setDimensions({
                  width: bloc.width,
                  height: bloc.height,
                  depth: bloc.depth,
                  weight: bloc.weight || "",
                })
              }
            >
              <span className="font-medium">{bloc.name}</span>
              <span className="text-gray-600 text-sm">
                {bloc.width} x {bloc.height} x {bloc.depth} cm
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditDimensions;
