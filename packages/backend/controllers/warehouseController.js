const Warehouse = require("../models/warehouseModel");
const User = require("../models/userModel");

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

    const location = {
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
    };

    const warehouse = new Warehouse({
      name,
      location: location,
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
    const warehouses = await Warehouse.find({ addedBy: req.user._id }).populate(
      {
        path: "members.user",
        select: "email username",
      }
    );

    res.status(200).json({ warehouses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).populate({
      path: "members.user",
      select: "email username",
    });

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

const addMember = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await Warehouse.findById(warehouseId);
    const email = req.body.email;
    const role = req.body.role;

    if (!role || !["ADMIN", "MEMBER", "GUEST"].includes(role)) {
      return res.status(400).json({
        message: "Role is required and must be ADMIN, MEMBER or GUEST",
      });
    }

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const isAdmin = warehouse.members.find(
      (member) =>
        member.user.toString() === req.user._id.toString() &&
        member.role === "ADMIN"
    );

    const isOwner = warehouse.addedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to invite members" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      warehouse.members.find(
        (member) => member.user.toString() === user._id.toString()
      )
    ) {
      return res.status(400).json({ message: "User already member" });
    }

    warehouse.members.push({ user: user._id, role: role });

    // If the user was pending, remove him from the pending list
    if (
      warehouse.pendingUsers.find(
        (pendingUser) => pendingUser.toString() === user._id
      )
    ) {
      warehouse.pendingUsers = warehouse.pendingUsers.filter(
        (pendingUser) => pendingUser.toString() !== user._id
      );
    }

    await warehouse.save();

    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { warehouseId, memberId } = req.params;
    const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const isAdmin = warehouse.members.find(
      (member) =>
        member.user.toString() === req.user._id.toString() &&
        member.role === "ADMIN"
    );

    const isOwner = warehouse.addedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to remove members" });
    }

    warehouse.members = warehouse.members.filter(
      (member) => member._id.toString() !== memberId.toString()
    );

    await warehouse.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changeRole = async (req, res) => {
  try {
    const { warehouseId, memberId } = req.params;
    const { role } = req.body;
    const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    if (!role || !["ADMIN", "MEMBER", "GUEST"].includes(role)) {
      return res.status(400).json({
        message: "Role is required and must be ADMIN, MEMBER or GUEST",
      });
    }

    const isAdmin = warehouse.members.find(
      (member) =>
        member.user.toString() === req.user._id.toString() &&
        member.role === "ADMIN"
    );

    const isOwner = warehouse.addedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to change role" });
    }

    const member = warehouse.members.find(
      (member) => member._id.toString() === memberId.toString()
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;
    await warehouse.save();

    res.status(200).json({ message: "Role changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createWarehouse,
  getWarehousesByUser,
  getWarehouseById,
  joinWarehouse,
  addMember,
  removeMember,
  changeRole,
  upload,
};
