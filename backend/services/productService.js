const Product = require("../models/Product");


// ========================================
// Get All Products
// ========================================

const getAllProducts = async () => {

  return await Product.find()
    .sort({
      createdAt: -1,
    });
};


// ========================================
// Get Product
// ========================================

const getProductById = async (
  productId
) => {

  return await Product.findById(
    productId
  );
};


// ========================================
// Create Product
// ========================================

const createNewProduct = async (
  productData
) => {

  return await Product.create(
    productData
  );
};


// ========================================
// Update Product
// ========================================

const updateExistingProduct = async (
  productId,
  productData
) => {

  return await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      new: true,
      runValidators: true,
    }
  );
};


// ========================================
// Delete Product
// ========================================

const deleteExistingProduct = async (
  productId
) => {

  return await Product.findByIdAndDelete(
    productId
  );
};


module.exports = {
  getAllProducts,
  getProductById,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
};