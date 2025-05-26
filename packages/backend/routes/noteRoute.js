const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addNote,
  deleteNote,
  getNotesFromBloc,
} = require("../controllers/noteController");

const noteRouter = express.Router();

/**
 * @swagger
 * /api/note/{blocId}:
 *   post:
 *     summary: Add a note to a bloc
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blocId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note added successfully
 *       401:
 *         description: Unauthorized
 */
noteRouter.post("/:blocId", authMiddleware, addNote);

/**
 * @swagger
 * /api/note/{noteId}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 */
noteRouter.delete("/:noteId", authMiddleware, deleteNote);

/**
 * @swagger
 * /api/note/{blocId}:
 *   get:
 *     summary: Get all notes from a bloc
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: blocId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notes
 */
noteRouter.get("/:blocId", getNotesFromBloc);

module.exports = noteRouter;
