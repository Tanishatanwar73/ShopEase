const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// ========================================
// GET MY WISHLIST
// ========================================

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    }).populate("products");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      products: wishlist.products || [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      products: [],
    });
  }
};

// ========================================
// ADD PRODUCT TO WISHLIST
// ========================================

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.userId,
        products: [productId],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (!alreadyExists) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    const updatedWishlist = await Wishlist.findOne({
      user: req.user.userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      products: updatedWishlist.products,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
};

// ========================================
// REMOVE PRODUCT FROM WISHLIST
// ========================================

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({
      user: req.user.userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      products: updatedWishlist.products,
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};