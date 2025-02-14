const Warehouse = require("../models/WarehouseModel");
const multer = require("multer");
const path = require("path");

// Configuration de Multer pour stocker les images dans "uploads/"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique
  },
});

const upload = multer({ storage: storage });

const createWarehouse = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if warehouse with the same name exists for the user
    const existingWarehouse = await Warehouse.findOne({
      name,
      addedBy: req.user._id,
    });

    if (existingWarehouse) {
      return res.status(400).json({
        message: "You already have a warehouse with the same name.",
      });
    }

    console.log(req.file);

    const warehouse = new Warehouse({
      name,
      location: req.body.location,
      maxWeight: req.body.maxWeight,
      description: req.body.description,
      width: req.body.width,
      height: req.body.height,
      depth: req.body.depth,
      addedBy: req.user._id,
      planImage: req.file ? `/uploads/${req.file.filename}` : null, // Stockage du chemin de l'image
    });

    await warehouse.save();

    return res.status(201).json({
      message: "Warehouse created successfully.",
      warehouse,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWarehousesByUser = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ addedBy: req.user._id });

    res.status(200).json({ warehouses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json({ warehouse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const joinWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await Warehouse.findById(warehouseId);
    const role = req.body.role;

    if (!role || !["ADMIN", "MEMBER", "GUEST"].includes(role)) {
      return res.status(400).json({
        message: "Role is required and must be ADMIN, MEMBER or GUEST",
      });
    }

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const user = req.user;

    if (
      warehouse.members.find((member) => member.user.toString() === user._id)
    ) {
      return res.status(400).json({ message: "User already authorized" });
    }

    warehouse.members.push({ user: user._id, role: role });
    await warehouse.save();

    user.warehouses.push(warehouse._id);
    await user.save();

    res.status(200).json({ message: "User authorized successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createWarehouse,
  getWarehousesByUser,
  getWarehouseById,
  joinWarehouse,
  upload,
};
