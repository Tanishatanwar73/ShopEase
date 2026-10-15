
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    return res.status(200).json({
      success: true,
      items: cart ? cart.items.filter(item => item.product) : [],
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// ADD PRODUCT TO CART
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "A valid product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          product: productId,
          quantity: 1,
        });
      }
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      items: cart.items.filter(item => item.product),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// UPDATE QUANTITY
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      entry => entry.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      items: cart.items.filter(entry => entry.product),
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// REMOVE PRODUCT
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        items: [],
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      items: cart.items.filter(item => item.product),
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
