const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addTag,
  deleteTag,
  getAllTags,
  updateTag,
} = require("../controllers/tagController");

const tagRouter = express.Router();

/**
 * @swagger
 * /api/tag/{warehouseId}:
 *   post:
 *     summary: Add a new tag to a warehouse
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
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
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       401:
 *         description: Unauthorized
 */
tagRouter.post("/:warehouseId", authMiddleware, addTag);

/**
 * @swagger
 * /api/tag/{tagId}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       401:
 *         description: Unauthorized
 */
tagRouter.delete("/:tagId", authMiddleware, deleteTag);

/**
 * @swagger
 * /api/tag/{warehouseId}:
 *   get:
 *     summary: Get all tags from a warehouse
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tags
 *       401:
 *         description: Unauthorized
 */
tagRouter.get("/:warehouseId", authMiddleware, getAllTags);

/**
 * @swagger
 * /api/tag/{tagId}:
 *   put:
 *     summary: Update a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       401:
 *         description: Unauthorized
 */
tagRouter.put("/:tagId", authMiddleware, updateTag);

module.exports = tagRouter;
