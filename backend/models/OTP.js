const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    // Email associated with OTP
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Six digit OTP
    otp: {
      type: String,
      required: true,
    },

    // OTP expiration time
    expiresAt: {
      type: Date,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const OTP = mongoose.model(
  "OTP",
  otpSchema
);

module.exports = OTP;