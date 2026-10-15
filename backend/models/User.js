const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // User name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    // Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // User or Admin
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Email verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Phone
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // Profile image
    profileImage: {
      type: String,
      default: "",
    },

    // Address
    address: {
      street: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;