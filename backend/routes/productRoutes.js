const express = require("express");

const {
  getProducts,
  getProduct,
  getDeals,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

router.get("/", getProducts);

router.get("/deals", getDeals);

router.get("/best-sellers", getBestSellers);

router.get("/:id", getProduct);

// ========================================
// ADMIN ROUTES
// ========================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;