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
  upload,
} = require("../controllers/blocController");

const blocRouter = express.Router();

blocRouter.get("/search/:warehouseId", authMiddleware, searchBloc);
blocRouter.get("/:blocId", getBloc);
blocRouter.post("/", authMiddleware, upload.single("picture"), createBloc);
blocRouter.delete("/:blocId", authMiddleware, checkBlocPermissions, deleteBloc);
blocRouter.put("/move", authMiddleware, moveBlocs); // Move multiple blocs
blocRouter.put("/:blocId/move", authMiddleware, checkBlocPermissions, moveBloc); // Move single bloc
blocRouter.put(
  "/:blocId",
  authMiddleware,
  upload.single("picture"),
  updateBloc
);
blocRouter.put("/:blocId/parent/:newParentId", authMiddleware, changeParent);

module.exports = blocRouter;
