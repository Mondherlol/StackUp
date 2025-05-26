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

/**
 * @swagger
 * /api/bloc/search/{warehouseId}:
 *   get:
 *     summary: Search blocs in a warehouse
 *     tags: [Blocs]
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
 *         description: List of matching blocs
 *       401:
 *         description: Unauthorized
 */
blocRouter.get("/search/:warehouseId", authMiddleware, searchBloc);

/**
 * @swagger
 * /api/bloc/all:
 *   get:
 *     summary: Get all blocs
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all blocs
 *       401:
 *         description: Unauthorized
 */
blocRouter.get("/all", authMiddleware, getAllBlocs);

/**
 * @swagger
 * /api/bloc/{blocId}:
 *   get:
 *     summary: Get bloc by ID
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blocId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bloc details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bloc not found
 */
blocRouter.get("/:blocId", authMiddleware, getBloc);

/**
 * @swagger
 * /api/bloc:
 *   post:
 *     summary: Create a new bloc
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Bloc created successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.post("/", authMiddleware, upload.single("picture"), createBloc);

/**
 * @swagger
 * /api/bloc/{blocId}:
 *   delete:
 *     summary: Delete a bloc
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blocId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bloc deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
blocRouter.delete("/:blocId", authMiddleware, checkBlocPermissions, deleteBloc);

/**
 * @swagger
 * /api/bloc/move:
 *   put:
 *     summary: Move multiple blocs
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocIds
 *               - newPosition
 *             properties:
 *               blocIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               newPosition:
 *                 type: object
 *     responses:
 *       200:
 *         description: Blocs moved successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put("/move", authMiddleware, moveBlocs);

/**
 * @swagger
 * /api/bloc/{blocId}/move:
 *   put:
 *     summary: Move a single bloc
 *     tags: [Blocs]
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
 *               - newPosition
 *             properties:
 *               newPosition:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bloc moved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
blocRouter.put("/:blocId/move", authMiddleware, checkBlocPermissions, moveBloc);

/**
 * @swagger
 * /api/bloc/change-warehouse/{blocId}:
 *   put:
 *     summary: Change warehouse of a bloc
 *     tags: [Blocs]
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
 *               - warehouseId
 *             properties:
 *               warehouseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Warehouse changed successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put("/change-warehouse/:blocId", authMiddleware, changeWarehouse);

/**
 * @swagger
 * /api/bloc/{blocId}:
 *   put:
 *     summary: Update bloc details
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blocId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Bloc updated successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put(
  "/:blocId",
  authMiddleware,
  upload.single("picture"),
  updateBloc
);

/**
 * @swagger
 * /api/bloc/{blocId}/parent/{newParentId}:
 *   put:
 *     summary: Change bloc's parent
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blocId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: newParentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parent changed successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put("/:blocId/parent/:newParentId", authMiddleware, changeParent);

/**
 * @swagger
 * /api/bloc/batch/parent:
 *   put:
 *     summary: Change parents for multiple blocs
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocIds
 *               - newParentId
 *             properties:
 *               blocIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               newParentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parents changed successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put("/batch/parent", authMiddleware, changeParentsBatch);

/**
 * @swagger
 * /api/bloc/batch/name:
 *   put:
 *     summary: Edit names for multiple blocs
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocIds
 *               - name
 *             properties:
 *               blocIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Names updated successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put("/batch/name", authMiddleware, editBatchName);

/**
 * @swagger
 * /api/bloc/batch/dimensions:
 *   put:
 *     summary: Update dimensions for multiple blocs
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocIds
 *               - dimensions
 *             properties:
 *               blocIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               dimensions:
 *                 type: object
 *     responses:
 *       200:
 *         description: Dimensions updated successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put("/batch/dimensions", authMiddleware, updateDimensionsBatch);

/**
 * @swagger
 * /api/bloc/batch/tags:
 *   put:
 *     summary: Update tags for multiple blocs
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocIds
 *               - tags
 *             properties:
 *               blocIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Tags updated successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put("/batch/tags", authMiddleware, updateTagsBatch);

/**
 * @swagger
 * /api/bloc/batch/picture:
 *   put:
 *     summary: Update picture for multiple blocs
 *     tags: [Blocs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - blocIds
 *             properties:
 *               blocIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Picture updated successfully
 *       401:
 *         description: Unauthorized
 */
blocRouter.put(
  "/batch/picture",
  authMiddleware,
  upload.single("picture"),
  updatePictureBatch
);

/**
 * @swagger
 * /api/bloc/get-batch:
 *   post:
 *     summary: Get multiple blocs by IDs
 *     tags: [Blocs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocIds
 *             properties:
 *               blocIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: List of requested blocs
 */
blocRouter.post("/get-batch/", getBatchBlocs);

module.exports = blocRouter;
