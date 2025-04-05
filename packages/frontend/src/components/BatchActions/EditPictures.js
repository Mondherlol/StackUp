import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosConfig";

const EditPicture = ({ batch, onSave }) => {
  const [file, setFile] = useState(null);

  const handleEditPicture = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner une image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("picture", file);
      // Au lieu de `JSON.stringify`, envoie le tableau directement

      formData.append("blocIds", JSON.stringify(batch.map((item) => item._id)));

      const formDataToSend = new FormData();

      const response = await axiosInstance.put(
        "/bloc/batch/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Image mise à jour avec succès.");
        onSave();
      } else {
        toast.error("Erreur lors de la mise à jour de l'image.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur inattendue.");
    }
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <h2 className="text-gray-800 text-lg font-semibold mb-4">
        Mettre à jour l’image
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
      />

      <button
        id="save-edit-picture"
        onClick={handleEditPicture}
        className="hidden"
      >
        Enregistrer
      </button>
    </div>
  );
};

export default EditPicture;
