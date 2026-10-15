const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ================================
// Logged-in user
// ================================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);


// ================================
// Admin
// ================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getUsers
);

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getUserById
);


module.exports = router;