const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  searchUsers,
  updateUser,
  upload,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile); // Protected route

router.get("/search", searchUsers);

router.put("/", authMiddleware, upload.single("profilePicture"), updateUser);

module.exports = router;
