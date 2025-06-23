const Warehouse = require("../models/warehouseModel");
const User = require("../models/userModel");
const Note = require("../models/noteModel");
const Tag = require("../models/tagModel");
const Block = require("../models/blocModel");

const multer = require("multer");
const path = require("path");

const crypto = require("crypto");

// Configuration of Multer to stock images in "uploads/"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique name
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
      planImage: req.file ? `/uploads/${req.file.filename}` : null, // File path
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
    const warehouses = await Warehouse.find({
      $or: [{ addedBy: req.user._id }, { "members.user": req.user._id }],
    }).populate([
      {
        path: "members.user",
        select: "email username",
      },
    ]);

    res.status(200).json({ warehouses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).populate([
      {
        path: "members.user",
        select: "email username",
      },
      {
        path: "blocs",
        populate: {
          path: "tags",
        },
      },
    ]);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json({ warehouse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const generateInviteLink = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { role } = req.body;

    if (!role || !["ADMIN", "MEMBER", "GUEST"].includes(role)) {
      return res.status(400).json({
        message: "Role is required and must be ADMIN, MEMBER or GUEST",
      });
    }

    const { warehouse, isAuthorized, error } =
      await getWarehouseAndCheckPermission(warehouseId, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    if (!isAuthorized) return res.status(403).json({ message: "Unauthorized" });

    const inviteToken = crypto.randomBytes(16).toString("hex");
    warehouse.inviteToken = inviteToken;
    warehouse.inviteRole = role;
    warehouse.inviteTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Expire après 24h
    await warehouse.save();

    const inviteLink = `${process.env.FRONTEND_URL}/join/${inviteToken}`;
    res.status(200).json({ inviteLink });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const joinWarehouse = async (req, res) => {
  try {
    const { inviteToken } = req.params;
    const warehouse = await Warehouse.findOne({ inviteToken });

    if (!warehouse || warehouse.inviteTokenExpiry < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid or expired invite link" });
    }

    if (
      warehouse.members.some(
        (member) => member.user.toString() === req.user._id.toString()
      )
    ) {
      return res.status(400).json({ message: "You're already a member" });
    }

    if (warehouse.addedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You're already the owner of this warehouse... Dumbass",
      });
    }

    warehouse.members.push({ user: req.user._id, role: warehouse.inviteRole });
    await warehouse.save();

    res.status(200).json({ message: "Successfully joined the warehouse" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWarehouseAndCheckPermission = async (warehouseId, userId) => {
  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse) {
    return { error: { status: 404, message: "Warehouse not found" } };
  }

  const isAdmin = warehouse.members.some(
    (member) =>
      member.user.toString() === userId.toString() && member.role === "ADMIN"
  );

  const isOwner = warehouse.addedBy.toString() === userId.toString();

  return { warehouse, isAuthorized: isAdmin || isOwner };
};

const addMember = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { email, role } = req.body;

    if (!role || !["ADMIN", "MEMBER", "GUEST"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const { warehouse, isAuthorized, error } =
      await getWarehouseAndCheckPermission(warehouseId, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    if (!isAuthorized) return res.status(403).json({ message: "Unauthorized" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      warehouse.members.some(
        (member) => member.user.toString() === user._id.toString()
      )
    ) {
      return res.status(400).json({ message: "User already a member" });
    }

    warehouse.members.push({ user: user._id, role });
    await warehouse.save();
    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { warehouseId, memberId } = req.params;
    const { warehouse, isAuthorized, error } =
      await getWarehouseAndCheckPermission(warehouseId, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    if (!isAuthorized) return res.status(403).json({ message: "Unauthorized" });

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

    if (!role || !["ADMIN", "MEMBER", "GUEST"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const { warehouse, isAuthorized, error } =
      await getWarehouseAndCheckPermission(warehouseId, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    if (!isAuthorized) return res.status(403).json({ message: "Unauthorized" });

    const member = warehouse.members.find(
      (member) => member._id.toString() === memberId.toString()
    );
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.role = role;
    await warehouse.save();
    res.status(200).json({ message: "Role changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, maxWeight } = req.body;

    const { warehouse, isAuthorized, error } =
      await getWarehouseAndCheckPermission(id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    if (!isAuthorized) return res.status(403).json({ message: "Unauthorized" });

    if (name) warehouse.name = name;
    if (description) warehouse.description = description;
    if (location) warehouse.location = location;
    if (maxWeight) warehouse.maxWeight = maxWeight;

    await warehouse.save();
    res
      .status(200)
      .json({ message: "Warehouse updated successfully", warehouse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const { warehouse, isAuthorized, error } =
      await getWarehouseAndCheckPermission(id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    if (!isAuthorized) return res.status(403).json({ message: "Unauthorized" });

    // Delete notes associated to a warehouse
    await Note.deleteMany({
      bloc: { $in: await Block.find({ warehouse: id }).select("_id") },
    });

    // Remove associated blocks
    await Block.deleteMany({ warehouse: id });

    // Remove associated tags
    await Tag.deleteMany({ warehouse: id });

    // Remove warehouse
    await warehouse.deleteOne();

    res
      .status(200)
      .json({ message: "Warehouse and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createWarehouse,
  getWarehousesByUser,
  getWarehouseById,
  generateInviteLink,
  joinWarehouse,
  addMember,
  removeMember,
  changeRole,
  updateWarehouse,
  deleteWarehouse,
  upload,
};
