const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkBlocPermissions } = require("../middlewares/checkBlocPermissions");
const {
  createBloc,
  deleteBloc,
  upload,
} = require("../controllers/blocController");

const blocRouter = express.Router();

blocRouter.post("/", authMiddleware, upload.single("picture"), createBloc);
blocRouter.delete("/:blocId", authMiddleware, checkBlocPermissions, deleteBloc);

module.exports = blocRouter;
