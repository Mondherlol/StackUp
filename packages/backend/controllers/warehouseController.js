const Warehouse = require("../models/WarehouseModel");

const createWarehouse = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const warehouse = new Warehouse({
      name,
      location: req.body.location,
      maxCapacity: req.body.maxCapacity,
      maxWeight: req.body.maxWeight,
      addedBy: req.user._id,
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
};
