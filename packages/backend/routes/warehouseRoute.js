const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createWarehouse,
  getWarehousesByUser,
  getWarehouseById,
  generateInviteLink,
  joinWarehouse,
  addMember,
  removeMember,
  changeRole,
  upload,
} = require("../controllers/warehouseController");

const warehouseRouter = express.Router();

warehouseRouter.post(
  "/",
  authMiddleware,
  upload.single("planImage"),
  createWarehouse
);
warehouseRouter.get("/", authMiddleware, getWarehousesByUser);
warehouseRouter.get("/:id", authMiddleware, getWarehouseById);
warehouseRouter.post(
  "/:warehouseId/invite",
  authMiddleware,
  generateInviteLink
);
warehouseRouter.post("/:warehouseId/addMember", authMiddleware, addMember);
warehouseRouter.put("/:warehouseId/role/:memberId", authMiddleware, changeRole);
warehouseRouter.delete(
  "/:warehouseId/removeMember/:memberId",
  authMiddleware,
  removeMember
);
warehouseRouter.post("/:inviteToken/join", authMiddleware, joinWarehouse);

module.exports = warehouseRouter;
