const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};

// ========================================
// GET SINGLE PRODUCT
// ========================================

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
};

// ========================================
// GET DEALS
// ========================================

const getDeals = async (req, res) => {
  try {
    const products = await Product.find({
      isDeal: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get deals error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch deals.",
    });
  }
};

// ========================================
// GET BEST SELLERS
// ========================================

const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({
      isBestSeller: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get best sellers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch best sellers.",
    });
  }
};

// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      isDeal,
      isBestSeller,
    } = req.body || {};

    // Check required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Convert values
    const productPrice = Number(price);
    const productStock = Number(stock);

    if (Number.isNaN(productPrice) || productPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number.",
      });
    }

    if (Number.isNaN(productStock) || productStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid number.",
      });
    }

    // Image URL
    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "shopease/products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    // Create product
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: productPrice,
      category: category.trim(),
      stock: productStock,
      image: imageUrl,

      isDeal:
        isDeal === "true" ||
        isDeal === true,

      isBestSeller:
        isBestSeller === "true" ||
        isBestSeller === true,

      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res) => {
  try {
    console.log("=================================");
    console.log("UPDATE PRODUCT");
    console.log("Product ID:", req.params.id);
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);
    console.log("=================================");

    const body = req.body || {};

    // Find product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // ========================================
    // UPDATE NAME
    // ========================================

    if (body.name !== undefined) {
      if (!String(body.name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty.",
        });
      }

      product.name = String(body.name).trim();
    }

    // ========================================
    // UPDATE DESCRIPTION
    // ========================================

    if (body.description !== undefined) {
      if (!String(body.description).trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty.",
        });
      }

      product.description =
        String(body.description).trim();
    }

    // ========================================
    // UPDATE PRICE
    // ========================================

    if (body.price !== undefined) {
      const price = Number(body.price);

      if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number.",
        });
      }

      product.price = price;
    }

    // ========================================
    // UPDATE CATEGORY
    // ========================================

    if (body.category !== undefined) {
      if (!String(body.category).trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty.",
        });
      }

      product.category =
        String(body.category).trim();
    }

    // ========================================
    // UPDATE STOCK
    // ========================================

    if (body.stock !== undefined) {
      const stock = Number(body.stock);

      if (Number.isNaN(stock) || stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a valid number.",
        });
      }

      product.stock = stock;
    }

    // ========================================
    // UPDATE DEAL STATUS
    // ========================================

    if (body.isDeal !== undefined) {
      product.isDeal =
        body.isDeal === "true" ||
        body.isDeal === true;
    }

    // ========================================
    // UPDATE BEST SELLER STATUS
    // ========================================

    if (body.isBestSeller !== undefined) {
      product.isBestSeller =
        body.isBestSeller === "true" ||
        body.isBestSeller === true;
    }

    // ========================================
    // UPDATE ACTIVE STATUS
    // ========================================

    if (body.isActive !== undefined) {
      product.isActive =
        body.isActive === "true" ||
        body.isActive === true;
    }

    // ========================================
    // UPDATE IMAGE
    // ========================================

    if (req.file) {
      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "shopease/products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        uploadStream.end(req.file.buffer);
      });

      // Save new image
      product.image = result.secure_url;
    }

    // ========================================
    // SAVE PRODUCT
    // ========================================

    await product.save();

    console.log(
      "Product updated successfully:",
      product._id
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
      error: error.message,
    });
  }
};

// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Delete product image from Cloudinary
    if (product.image) {
      try {
        const urlParts = product.image.split("/");

        const uploadIndex =
          urlParts.indexOf("upload");

        if (uploadIndex !== -1) {
          const publicIdWithExtension =
            urlParts
              .slice(uploadIndex + 2)
              .join("/");

          const publicId =
            publicIdWithExtension.replace(
              /\.[^/.]+$/,
              ""
            );

          await cloudinary.uploader.destroy(
            publicId
          );
        }
      } catch (imageError) {
        console.log(
          "Image delete failed:",
          imageError.message
        );
      }
    }

    // Delete product
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
      error: error.message,
    });
  }
};

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
  getProducts,
  getProduct,
  getDeals,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
};