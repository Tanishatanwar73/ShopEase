const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // Product description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Product price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Product category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Product stock
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Cloudinary image URL
    image: {
      type: String,
      default: "",
    },

    // Product rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Number of reviews
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product active/inactive
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeal: {
    type: Boolean,
    default: false,
},

isBestSeller: {
  type: Boolean,
  default: false,
},

isActive: {
  type: Boolean,
  default: true,
},
  },
  {
    timestamps: true,
  }
);


// Create Product model
const Product = mongoose.model(
  "Product",
  productSchema
);


module.exports = Product;