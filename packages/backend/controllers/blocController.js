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
      .populate({
        path: "blocs",
        populate: { path: "tags" },
      })
      .populate("addedBy", "username")
      .populate("tags");

    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }

    // Query get chain of parents
    if (!req.query.parentChain) {
      return res.status(200).json(bloc);
    }

    // Get parent chain
    const parentChain = [];
    let currentParent = await Bloc.findById(bloc.parent);

    while (currentParent) {
      parentChain.unshift({
        _id: currentParent._id,
        name: currentParent.name,
      });
      currentParent = await Bloc.findById(currentParent.parent);
    }

    // Add parent chain to response
    const response = bloc.toObject();
    response.parentChain = parentChain;

    res.status(200).json(response);
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
      sameNameForAll,
      nbBlocks,
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

    const createdBlocs = [];
    const blocCount = parseInt(nbBlocks) || 1;

    for (let i = 0; i < blocCount; i++) {
      let blocName = name;
      if (!sameNameForAll || sameNameForAll == "false") {
        blocName = `${name}_${i + 1}`;
      }
      // Bloc creation
      const newBloc = new Bloc({
        name: blocName,
        picture: req.file ? `/uploads/bloc/${req.file.filename}` : null,
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
      console.log("Saved Bloc Id :", savedBloc._id);
      console.log("New Bloc Id :", newBloc._id);

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
      console.log("Bloc parent :", newBloc.parent);
      // Add the bloc to the warehouse if no parent
      if (!newBloc.parent) {
        warehouseExists.blocs.push(savedBloc._id);
      }

      createdBlocs.push(savedBloc);
    }

    // Save warehouse after all blocs are created
    await warehouseExists.save();

    res.status(201).json({
      message: `${blocCount} bloc(s) added with success`,
      blocs: createdBlocs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
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
    }).populate("tags");

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

const changeParent = async (req, res) => {
  try {
    const { blocId, newParentId } = req.params;
    const bloc = await Bloc.findById(blocId);
    if (!bloc) {
      return;
    }

    // Remove bloc from old parent
    if (bloc.parent) {
      const oldParent = await Bloc.findById(bloc.parent);
      if (oldParent) {
        oldParent.blocs = oldParent.blocs.filter(
          (id) => id.toString() !== bloc._id.toString()
        );
        await oldParent.save();
      }
    } else {
      // If he doesnt have parent then remove from warehouse root blocs
      const warehouse = await Warehouse.findById(bloc.warehouse);
      if (warehouse) {
        warehouse.blocs = warehouse.blocs.filter(
          (id) => id.toString() !== bloc._id.toString()
        );
        await warehouse.save();
      }
    }

    // Add bloc to new parent
    if (newParentId) {
      const newParent = await Bloc.findById(newParentId);
      if (newParent) {
        newParent.blocs.push(bloc._id);
        await newParent.save();
      }
    }

    bloc.parent = newParentId;
    await bloc.save();

    return res.status(200).json({ message: "Parent changed with success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const changeParentsBatch = async (req, res) => {
  try {
    const { newParentId } = req.body;
    const { blocIds } = req.body;

    if (!blocIds) {
      return res.status(400).json({ message: "blocIds is required" });
    }

    for (let blocId of blocIds) {
      const bloc = await Bloc.findById(blocId);
      if (!bloc) {
        continue;
      }

      // Remove bloc from old parent
      if (bloc.parent) {
        const oldParent = await Bloc.findById(bloc.parent);
        if (oldParent) {
          oldParent.blocs = oldParent.blocs.filter(
            (id) => id.toString() !== bloc._id.toString()
          );
          await oldParent.save();
        }
      } else {
        // If it doesn't have a parent then remove from warehouse root blocs
        const warehouse = await Warehouse.findById(bloc.warehouse);
        if (warehouse) {
          warehouse.blocs = warehouse.blocs.filter(
            (id) => id.toString() !== bloc._id.toString()
          );
          await warehouse.save();
        }
      }

      // Add bloc to new parent
      if (newParentId) {
        const newParent = await Bloc.findById(newParentId);
        if (newParent) {
          newParent.blocs.push(bloc._id);
          await newParent.save();
        }
      } else {
        // Add bloc to warehouse root if no new parent
        const warehouse = await Warehouse.findById(bloc.warehouse);
        if (warehouse) {
          warehouse.blocs.push(bloc._id);
          await warehouse.save();
        }
      }

      bloc.parent = newParentId || null;
      await bloc.save();
    }

    return res.status(200).json({ message: "Parents changed with success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateTagsBatch = async (req, res) => {
  try {
    const { blocIds, tags, removeOtherTags } = req.body;
    if (!blocIds || !Array.isArray(blocIds)) {
      return res.status(400).json({ message: "blocIds must be an array" });
    }

    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ message: "tags must be an array" });
    }

    // Vérifier si les tags sont valides
    const validTags = tags.filter((tag) =>
      mongoose.Types.ObjectId.isValid(tag)
    );
    if (validTags.length !== tags.length) {
      return res.status(400).json({ message: "Invalid tag IDs" });
    }

    // Mise à jour en boucle (peut être optimisée en bulkWrite aussi)

    for (let blocId of blocIds) {
      const bloc = await Bloc.findById(blocId);
      if (!bloc) continue;

      if (removeOtherTags) {
        // Supprimer tous les tags existants
        bloc.tags = [];
      }
      // Add new tags if not already present
      const existingTagIds = bloc.tags.map((tag) => tag._id.toString());
      const newTags = validTags.filter(
        (tag) => !existingTagIds.includes(tag.toString())
      );
      bloc.tags.push(...newTags);
      await bloc.save();
    }

    return res.status(200).json({ message: "Tags updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateDimensionsBatch = async (req, res) => {
  try {
    const { blocIds, width, height, depth, weight } = req.body;

    if (!blocIds || !Array.isArray(blocIds)) {
      return res.status(400).json({ message: "blocIds must be an array" });
    }

    const updateFields = {};
    if (width !== undefined) updateFields.width = width;
    if (height !== undefined) updateFields.height = height;
    if (depth !== undefined) updateFields.depth = depth;
    if (weight !== undefined) updateFields.weight = weight;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "At least one dimension must be provided" });
    }

    // Mise à jour en boucle (peut être optimisée en bulkWrite aussi)
    for (let blocId of blocIds) {
      const bloc = await Bloc.findById(blocId);
      if (!bloc) continue;

      Object.assign(bloc, updateFields);
      await bloc.save();
    }

    return res.status(200).json({ message: "Dimensions updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const searchBloc = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { query, tags, sortBy } = req.query;
    const filter = {
      warehouse: warehouseId,
      name: { $regex: query || "", $options: "i" },
    };

    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    const sortOptions = {};
    if (sortBy) {
      const sortFields = sortBy.split(",");
      sortFields.forEach((field) => {
        const [key, order] = field.split(":");
        sortOptions[key] = order === "desc" ? -1 : 1;
      });
    }

    const blocs = await Bloc.find(filter)
      .populate("tags")
      .populate("parent")
      .sort(sortOptions);

    res.status(200).json(blocs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const editBatchName = async (req, res) => {
  try {
    const { blocIds } = req.body;
    const { name, sameNameForAll } = req.body;

    if (!blocIds) {
      return res.status(400).json({ message: "blocIds is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    for (i = 0; i < blocIds.length; i++) {
      const blocId = blocIds[i];
      const bloc = await Bloc.findById(blocId);
      if (!bloc) {
        continue;
      }

      bloc.name = sameNameForAll ? name : `${name}_${i + 1}`;
      await bloc.save();
    }

    return res.status(200).json({ message: "Names updated with success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getBatchBlocs = async (req, res) => {
  try {
    const { blocIds } = req.body;

    if (!blocIds) {
      return res.status(400).json({ message: "blocIds is required" });
    }

    const blocs = await Bloc.find({ _id: { $in: blocIds } });

    return res.status(200).json(blocs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllBlocs = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({
      $or: [
        {
          members: {
            $elemMatch: {
              user: req.user._id,
              role: { $in: ["ADMIN", "MEMBER"] },
            },
          },
        },
        { addedBy: req.user._id },
      ],
    });

    const warehouseIds = warehouses.map((w) => w._id);
    const blocs = await Bloc.find({
      warehouse: { $in: warehouseIds },
    })
      .populate("tags")
      .populate("warehouse", "name _id");

    return res.status(200).json(blocs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const changeWarehouse = async (req, res) => {
  try {
    const { blocId } = req.params;
    const { newWarehouseId } = req.body;

    // Vérifier si le bloc et le nouveau warehouse existent
    const bloc = await Bloc.findById(blocId);
    if (!bloc) return res.status(404).json({ message: "Bloc not found" });

    const newWarehouse = await Warehouse.findById(newWarehouseId);
    if (!newWarehouse)
      return res.status(404).json({ message: "New warehouse not found" });

    // Retirer le bloc de l'ancien warehouse
    const oldWarehouse = await Warehouse.findById(bloc.warehouse);
    if (oldWarehouse) {
      oldWarehouse.blocs = oldWarehouse.blocs.filter(
        (id) => id.toString() !== bloc._id.toString()
      );
      await oldWarehouse.save();
    }

    // Ajouter le bloc au nouveau warehouse
    newWarehouse.blocs.push(bloc._id);
    await newWarehouse.save();

    // Fonction récursive pour mettre à jour les descendants
    const updateChildrenWarehouse = async (parentId) => {
      const children = await Bloc.find({ parent: parentId });

      for (const child of children) {
        child.warehouse = newWarehouseId;
        await child.save(); // ou faire un bulkWrite pour plus d’optimisation si beaucoup d’enfants

        // Appel récursif
        await updateChildrenWarehouse(child._id);
      }
    };

    // Mettre à jour le bloc racine
    bloc.warehouse = newWarehouseId;
    await bloc.save();

    // Mettre à jour récursivement tous les descendants
    await updateChildrenWarehouse(blocId);

    return res
      .status(200)
      .json({ message: "Bloc and its children moved to new warehouse" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updatePictureBatch = async (req, res) => {
  try {
    let blocIds = req.body.blocIds;

    try {
      blocIds = typeof blocIds === "string" ? JSON.parse(blocIds) : blocIds;
    } catch (err) {
      return res.status(400).json({ message: "Invalid blocIds format" });
    }

    if (!Array.isArray(blocIds)) {
      return res.status(400).json({ message: "blocIds must be an array" });
    }

    // Vérifier s’il y a une image envoyée
    if (!req.file) {
      return res.status(400).json({ message: "A picture file is required" });
    }

    const updatedPicture = `/uploads/bloc/${req.file.filename}`;

    const updatedBlocs = [];

    for (let blocId of blocIds) {
      const bloc = await Bloc.findById(blocId);
      if (!bloc) continue;

      bloc.picture = updatedPicture;
      bloc.lastUpdate = Date.now();
      await bloc.save();

      updatedBlocs.push(bloc);
    }

    return res.status(200).json({
      message: "Pictures updated successfully",
      updatedCount: updatedBlocs.length,
      blocs: updatedBlocs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getBloc,
  createBloc,
  deleteBloc,
  moveBlocs,
  moveBloc,
  updateBloc,
  changeParent,
  searchBloc,
  changeParentsBatch,
  updateDimensionsBatch,
  updatePictureBatch,
  upload,
  editBatchName,
  getBatchBlocs,
  getAllBlocs,
  updateTagsBatch,
  changeWarehouse,
};
