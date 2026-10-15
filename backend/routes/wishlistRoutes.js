const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's wishlist
router.get(
  "/",
  authMiddleware,
  getWishlist
);

// Add product
router.post(
  "/",
  authMiddleware,
  addToWishlist
);

// Remove product
router.delete(
  "/:productId",
  authMiddleware,
  removeFromWishlist
);

module.exports = router;