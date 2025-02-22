const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addTag,
  deleteTag,
  getAllTags,
  updateTag,
} = require("../controllers/tagController");

const tagRouter = express.Router();

tagRouter.post("/:warehouseId", authMiddleware, addTag);
tagRouter.delete("/:tagId", authMiddleware, deleteTag);
tagRouter.get("/:warehouseId", authMiddleware, getAllTags);
tagRouter.put("/:tagId", authMiddleware, updateTag);

module.exports = tagRouter;
