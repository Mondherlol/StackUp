const Bloc = require("../models/blocModel");
const Warehouse = require("../models/warehouseModel");
const mongoose = require("mongoose");

const path = require("path");
const multer = require("multer");

// Config of Multer to store images in "uploads/bloc/" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/bloc/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique name
  },
});

const upload = multer({ storage: storage });

const getBloc = async (req, res) => {
  try {
    const { blocId } = req.params;
    const bloc = await Bloc.findById(blocId)
      .populate("blocs")
      .populate("addedBy", "username")
      .populate("tags");

    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }

    res.status(200).json(bloc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const createBloc = async (req, res) => {
  try {
    const {
      name,
      parent,
      height,
      width,
      depth,
      weight,
      maxWeight,
      blocs,
      customFields,
      warehouse,
    } = req.body;

    // Check if warehouse exists
    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return res.status(404).json({ message: "Warehouse doesn't exist" });
    }
    const tags = req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(",")
      : [];

    // Bloc creation
    const newBloc = new Bloc({
      name,
      picture: req.file ? `/uploads/bloc/${req.file.filename}` : null, // Picture path
      height,
      width,
      depth,
      weight,
      maxWeight,
      blocs,
      tags,
      customFields,
      warehouse,
      addedBy: req.user._id,
    });

    if (parent && parent !== null && parent !== "null") {
      newBloc.parent = parent;
    }

    // Save the bloc
    const savedBloc = await newBloc.save();

    // Add the bloc to the parent
    if (newBloc.parent) {
      const parentBloc = await Bloc.findById(newBloc.parent);
      parentBloc.blocs.push(savedBloc._id);

      // Add the weight of the new bloc to the parent (if defined)
      if (newBloc.weight) {
        if (!parentBloc.weight) parentBloc.weight = 0;

        if (
          parentBloc.maxWeight &&
          parentBloc.weight + newBloc.weight > parentBloc.maxWeight
        ) {
          return res.status(400).json({
            message: "Parent bloc can't support the weight of the new bloc",
          });
        }

        parentBloc.weight += newBloc.weight;
      }
      await parentBloc.save();
    }

    // Add the bloc to the warehouse
    if (!newBloc.parent) {
      warehouseExists.blocs.push(savedBloc._id);
      await warehouseExists.save();
    }
    res
      .status(201)
      .json({ message: "Bloc added with success", bloc: savedBloc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Servor error", error });
  }
};

const deleteBloc = async (req, res) => {
  try {
    const { blocId } = req.params;
    const bloc = await Bloc.findById(blocId);
    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }
    const warehouse = await Warehouse.findById(bloc.warehouse);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    warehouse.blocs = warehouse.blocs.filter(
      (bloc) => bloc.toString() !== blocId
    );
    await warehouse.save();

    // We need to delete all children blocs
    const deleteChildren = async (blocId) => {
      const children = await Bloc.find({ parent: blocId });
      for (let child of children) {
        await deleteChildren(child._id);
        await Bloc.deleteOne({ _id: child._id });
      }
    };

    // If have parent, we need to remove the bloc from the parent
    if (bloc.parent) {
      const parent = await Bloc.findById(bloc.parent);
      parent.blocs = parent.blocs.filter((bloc) => bloc.toString() !== blocId);
      await parent.save();
    }

    await Bloc.deleteOne({ _id: blocId });
    res.status(200).json({ message: "Bloc deleted with success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const moveBlocs = async (req, res) => {
  try {
    const { blocs } = req.body;
    for (let bloc of blocs) {
      await Bloc.updateOne({ _id: bloc._id }, { position: bloc.position });
    }
    res.status(200).json({ message: "Blocs moved with success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateBloc = async (req, res) => {
  try {
    const { blocId } = req.params;
    const {
      name,
      parent,
      height,
      width,
      depth,
      weight,
      maxWeight,
      blocs,
      customFields,
      warehouse,
    } = req.body;

    // Vérifier si le bloc existe
    const bloc = await Bloc.findById(blocId);
    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }

    // Vérifier si l'entrepôt existe
    if (warehouse) {
      const warehouseExists = await Warehouse.findById(warehouse);
      if (!warehouseExists) {
        return res.status(404).json({ message: "Warehouse doesn't exist" });
      }
    }

    // Gérer les tags
    const updatedTags = req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
            .map((tag) =>
              mongoose.Types.ObjectId.isValid(tag)
                ? new mongoose.Types.ObjectId(tag)
                : null
            ) // Only convert valid ObjectId strings
            .filter((tag) => tag !== null) // Remove invalid tags
        : req.body.tags
            .split(",")
            .map((tag) =>
              mongoose.Types.ObjectId.isValid(tag)
                ? new mongoose.Types.ObjectId(tag)
                : null
            ) // Same for comma-separated string
            .filter((tag) => tag !== null) // Remove invalid tags
      : [];

    // Vérifier si l'image est mise à jour
    const updatedPicture = req.file
      ? `/uploads/bloc/${req.file.filename}`
      : bloc.picture;

    // Mise à jour des données
    const updatedData = {
      name: name ?? bloc.name,
      picture: updatedPicture,
      height: height ?? bloc.height,
      width: width ?? bloc.width,
      depth: depth ?? bloc.depth,
      weight: weight ?? bloc.weight,
      maxWeight: maxWeight ?? bloc.maxWeight,
      blocs: blocs ?? bloc.blocs,
      tags: updatedTags,
      customFields: customFields ?? bloc.customFields,
      warehouse: warehouse ?? bloc.warehouse,
      lastUpdate: Date.now(),
    };

    // Vérifier si le parent a changé
    if (parent && parent !== bloc.parent?.toString()) {
      // Retirer le bloc de l'ancien parent
      if (bloc.parent) {
        const oldParent = await Bloc.findById(bloc.parent);
        if (oldParent) {
          oldParent.blocs = oldParent.blocs.filter(
            (id) => id.toString() !== bloc._id.toString()
          );
          await oldParent.save();
        }
      }

      // Ajouter le bloc au nouveau parent
      if (parent !== "null") {
        const newParent = await Bloc.findById(parent);
        if (newParent) {
          newParent.blocs.push(bloc._id);
          await newParent.save();
          updatedData.parent = parent;
        }
      } else {
        updatedData.parent = null;
      }
    }

    // Vérifier si le poids a changé et ajuster le parent
    if (weight && weight !== bloc.weight) {
      if (bloc.parent) {
        const parentBloc = await Bloc.findById(bloc.parent);
        if (parentBloc) {
          const weightDifference = weight - (bloc.weight || 0);

          if (
            parentBloc.maxWeight &&
            parentBloc.weight + weightDifference > parentBloc.maxWeight
          ) {
            return res.status(400).json({
              message: "Parent bloc can't support the updated weight",
            });
          }

          parentBloc.weight += weightDifference;
          await parentBloc.save();
        }
      }
    }

    // Appliquer les mises à jour
    const updatedBloc = await Bloc.findByIdAndUpdate(blocId, updatedData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Bloc updated successfully", bloc: updatedBloc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const moveBloc = async (req, res) => {
  try {
    const { blocId } = req.params;
    const { position } = req.body;
    const bloc = await Bloc.findById(blocId);
    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }
    bloc.position = position;
    await bloc.save();
    return res.status(200).json({ message: "Bloc moved with success" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getBloc,
  createBloc,
  deleteBloc,
  moveBlocs,
  moveBloc,
  updateBloc,
  upload,
};
