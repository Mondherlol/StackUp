const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createWarehouse,
  getWarehousesByUser,
  getWarehouseById,
  joinWarehouse,
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
warehouseRouter.post("/:warehouseId/join", authMiddleware, joinWarehouse);

module.exports = warehouseRouter;
