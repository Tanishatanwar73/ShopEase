const bcrypt = require("bcryptjs");

const User = require("../models/User");
const OTP = require("../models/OTP");

const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");


// ========================================
// Create User
// ========================================

const createUser = async ({
  name,
  email,
  password,
}) => {

  const existingUser =
    await User.findOne({ email });

  if (existingUser) {
    throw new Error(
      "User already exists."
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
    isVerified: false,
  });

  return user;
};


// ========================================
// Create OTP
// ========================================

const createOTP = async (email) => {

  await OTP.deleteMany({ email });

  const otp = generateOTP();

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await OTP.create({
    email,
    otp,
    expiresAt,
  });

  return otp;
};


// ========================================
// Verify OTP
// ========================================

const verifyUserOTP = async ({
  email,
  otp,
}) => {

  const otpRecord =
    await OTP.findOne({
      email,
      otp,
    });

  if (!otpRecord) {
    throw new Error("Invalid OTP.");
  }

  if (
    otpRecord.expiresAt < new Date()
  ) {
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    throw new Error(
      "OTP has expired."
    );
  }

  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  user.isVerified = true;

  await user.save();

  await OTP.deleteOne({
    _id: otpRecord._id,
  });

  return user;
};


// ========================================
// Login User
// ========================================

const loginUser = async ({
  email,
  password,
}) => {

  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }

  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new Error(
      "Invalid email or password."
    );
  }

  if (!user.isVerified) {
    throw new Error(
      "Please verify your email first."
    );
  }

  const token =
    generateToken(
      user._id,
      user.role
    );

  return {
    token,
    user,
  };
};


module.exports = {
  createUser,
  createOTP,
  verifyUserOTP,
  loginUser,
};