const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  searchUsers,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile); // Protected route

router.get("/search", searchUsers);

module.exports = router;
