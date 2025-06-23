const Bloc = require("../models/blocModel");
const Warehouse = require("../models/warehouseModel");

const checkBlocPermissions = async (req, res, next) => {
  try {
    const userId = req.user._id; // user fetching from the auth middleware
    const { blocId } = req.params; // bloc ID to modify or delete

    // Fetch the bloc 
    const bloc = await Bloc.findById(blocId).populate("warehouse");

    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }

    // Fetch associated warehouse 
    const warehouse = await Warehouse.findById(bloc.warehouse).populate(
      "members.user"
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse non trouvé" });
    }

    // Check if the user is the creator of the Warehouse
    if (warehouse.addedBy.toString() === userId.toString()) {
      return next();
    }

    // Check if the user is a member with the role "ADMIN" or "MEMBER"
    const isAuthorized = warehouse.members.some(
      (member) =>
        member.user._id.toString() === userId.toString() &&
        (member.role === "ADMIN" || member.role === "MEMBER")
    );

    if (!isAuthorized) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Error of permission:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkBlocPermissions };
