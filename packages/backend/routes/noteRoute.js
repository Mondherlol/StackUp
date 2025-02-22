const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addNote,
  deleteNote,
  getNotesFromBloc,
} = require("../controllers/noteController");

const noteRouter = express.Router();

noteRouter.post("/:blocId", authMiddleware, addNote);
noteRouter.delete("/:noteId", authMiddleware, deleteNote);
noteRouter.get("/:blocId", getNotesFromBloc);
module.exports = noteRouter;
