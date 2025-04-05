const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkBlocPermissions } = require("../middlewares/checkBlocPermissions");
const {
  searchBloc,
  getBloc,
  createBloc,
  deleteBloc,
  moveBlocs,
  moveBloc,
  updateBloc,
  changeParent,
  changeParentsBatch,
  editBatchName,
  updateDimensionsBatch,
  updatePictureBatch,
  getBatchBlocs,
  getAllBlocs,
  updateTagsBatch,
  changeWarehouse,
  upload,
} = require("../controllers/blocController");

const blocRouter = express.Router();

blocRouter.get("/search/:warehouseId", authMiddleware, searchBloc);
blocRouter.get("/all", authMiddleware, getAllBlocs);
blocRouter.get("/:blocId", authMiddleware, getBloc);
blocRouter.post("/", authMiddleware, upload.single("picture"), createBloc);
blocRouter.delete("/:blocId", authMiddleware, checkBlocPermissions, deleteBloc);
blocRouter.put("/move", authMiddleware, moveBlocs); // Move multiple blocs
blocRouter.put("/:blocId/move", authMiddleware, checkBlocPermissions, moveBloc); // Move single bloc
blocRouter.put("/change-warehouse/:blocId", authMiddleware, changeWarehouse); // Change warehouse of a bloc

blocRouter.put(
  "/:blocId",
  authMiddleware,
  upload.single("picture"),
  updateBloc
);
blocRouter.put("/:blocId/parent/:newParentId", authMiddleware, changeParent);
blocRouter.put("/batch/parent", authMiddleware, changeParentsBatch);
blocRouter.put("/batch/name", authMiddleware, editBatchName);
blocRouter.put("/batch/dimensions", authMiddleware, updateDimensionsBatch);
blocRouter.put("/batch/tags", authMiddleware, updateTagsBatch);
blocRouter.put(
  "/batch/picture",
  authMiddleware,
  upload.single("picture"),
  updatePictureBatch
);

blocRouter.post("/get-batch/", getBatchBlocs);

module.exports = blocRouter;
