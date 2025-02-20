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
      parent,
      height,
      width,
      depth,
      weight,
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
    const bloc = await Bloc.findById(blocId);
    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }
    const {
      name,
      position,
      height,
      width,
      depth,
      weight,
      maxWeight,
      blocs,
      customFields,
    } = req.body;
    bloc.name = name;
    bloc.height = height;
    bloc.width = width;
    bloc.depth = depth;
    bloc.position = position;
    bloc.weight = weight;
    bloc.maxWeight = maxWeight;
    bloc.blocs = blocs;
    bloc.customFields = customFields;
    await bloc.save();
    res.status(200).json({ message: "Bloc updated with success" });
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
  createBloc,
  deleteBloc,
  moveBlocs,
  moveBloc,
  updateBloc,
  upload,
};
