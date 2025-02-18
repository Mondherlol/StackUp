const Bloc = require("../models/blocModel");
const Warehouse = require("../models/warehouseModel");

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

const createBloc = async (req, res) => {
  try {
    const {
      name,
      picture,
      parent,
      height,
      width,
      depth,
      weight,
      capacity,
      maxWeight,
      blocs,
      tags,
      customFields,
      warehouse,
    } = req.body;

    // Check if warehouse exists
    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return res.status(404).json({ message: "Warehouse doesn't exist" });
    }

    // Bloc creation
    const newBloc = new Bloc({
      name,
      picture: req.file ? `/uploads/bloc/${req.file.filename}` : null, // Picture path
      parent,
      height,
      width,
      depth,
      weight,
      capacity,
      maxWeight,
      blocs,
      tags,
      customFields,
      warehouse,
      addedBy: req.user._id,
    });

    // Save the bloc
    const savedBloc = await newBloc.save();

    // Add the bloc to the warehouse
    warehouseExists.blocs.push(savedBloc._id);
    await warehouseExists.save();

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

    await Bloc.deleteOne({ _id: blocId });
    res.status(200).json({ message: "Bloc deleted with success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createBloc,
  deleteBloc,
  upload,
};
