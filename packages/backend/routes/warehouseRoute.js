const express = require("express");

const { authMiddleware } = require("../middlewares/authMiddleware");

const warehouseRouter = express.Router();

const {
  createWarehouse,
  getWarehousesByUser,
  getWarehouseById,
  joinWarehouse,
} = require("../controllers/warehouseController");

warehouseRouter.post("/", authMiddleware, createWarehouse);
warehouseRouter.get("/", authMiddleware, getWarehousesByUser);
warehouseRouter.get("/:id", authMiddleware, getWarehouseById);
warehouseRouter.post("/:warehouseId/join", authMiddleware, joinWarehouse);

module.exports = warehouseRouter;
