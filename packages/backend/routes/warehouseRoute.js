const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createWarehouse,
  getWarehousesByUser,
  getWarehouseById,
  generateInviteLink,
  joinWarehouse,
  addMember,
  removeMember,
  changeRole,
  updateWarehouse,
  deleteWarehouse,
  upload,
} = require("../controllers/warehouseController");

const warehouseRouter = express.Router();

/**
 * @swagger
 * /api/warehouse:
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouses]
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
 *               planImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.post(
  "/",
  authMiddleware,
  upload.single("planImage"),
  createWarehouse
);

/**
 * @swagger
 * /api/warehouse:
 *   get:
 *     summary: Get all warehouses for the current user
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of warehouses
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.get("/", authMiddleware, getWarehousesByUser);

/**
 * @swagger
 * /api/warehouse/{id}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Warehouse details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Warehouse not found
 */
warehouseRouter.get("/:id", authMiddleware, getWarehouseById);

/**
 * @swagger
 * /api/warehouse/{warehouseId}/invite:
 *   post:
 *     summary: Generate invite link for warehouse
 *     tags: [Warehouses]
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
 *         description: Invite link generated
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.post(
  "/:warehouseId/invite",
  authMiddleware,
  generateInviteLink
);

/**
 * @swagger
 * /api/warehouse/{warehouseId}/addMember:
 *   post:
 *     summary: Add a member to warehouse
 *     tags: [Warehouses]
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added successfully
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.post("/:warehouseId/addMember", authMiddleware, addMember);

/**
 * @swagger
 * /api/warehouse/{warehouseId}/role/{memberId}:
 *   put:
 *     summary: Change member role in warehouse
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.put("/:warehouseId/role/:memberId", authMiddleware, changeRole);

/**
 * @swagger
 * /api/warehouse/{warehouseId}/removeMember/{memberId}:
 *   delete:
 *     summary: Remove member from warehouse
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.delete(
  "/:warehouseId/removeMember/:memberId",
  authMiddleware,
  removeMember
);

/**
 * @swagger
 * /api/warehouse/{inviteToken}/join:
 *   post:
 *     summary: Join warehouse using invite token
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully joined warehouse
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid invite token
 */
warehouseRouter.post("/:inviteToken/join", authMiddleware, joinWarehouse);

/**
 * @swagger
 * /api/warehouse/{id}:
 *   put:
 *     summary: Update warehouse details
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.put("/:id", authMiddleware, updateWarehouse);

/**
 * @swagger
 * /api/warehouse/{id}:
 *   delete:
 *     summary: Delete warehouse
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
 *       401:
 *         description: Unauthorized
 */
warehouseRouter.delete("/:id", authMiddleware, deleteWarehouse);

module.exports = warehouseRouter;
