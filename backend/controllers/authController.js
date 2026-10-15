const bcrypt = require("bcryptjs");

const User = require("../models/User");
const OTP = require("../models/OTP");

const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");

const sendEmail = require("../services/emailService");


// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    // User already exists and is verified
    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // User exists but is not verified
    // Send a new OTP
    if (user && !user.isVerified) {
      const otp = generateOTP();

      // Delete old OTP
      await OTP.deleteMany({ email });

      // Save new OTP
      await OTP.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      // Send OTP email
      await sendEmail({
        to: email,
        subject: "ShopEase Email Verification OTP",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>ShopEase Email Verification</h2>

            <p>Hello ${user.name},</p>

            <p>Your new verification OTP is:</p>

            <h1 style="letter-spacing: 8px;">
              ${otp}
            </h1>

            <p>This OTP will expire in 10 minutes.</p>

            <p>If you did not request this OTP, please ignore this email.</p>

            <p>Thank you,<br>ShopEase Team</p>
          </div>
        `,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent again. Please verify your email.",
      });
    }

    // =================================================
    // CREATE NEW USER
    // =================================================

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      role: "user",
      isVerified: false,
    });

    // =================================================
    // GENERATE OTP
    // =================================================

    const otp = generateOTP();

    // Save OTP
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send OTP email
    await sendEmail({
      to: email,
      subject: "ShopEase Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>ShopEase Email Verification</h2>

          <p>Hello ${user.name},</p>

          <p>Thank you for registering with ShopEase.</p>

          <p>Your verification OTP is:</p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>This OTP will expire in 10 minutes.</p>

          <p>If you did not create this account, please ignore this email.</p>

          <p>Thank you,<br>ShopEase Team</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};


// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteMany({ email });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify user
    user.isVerified = true;

    await user.save();

    // Delete OTP
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
      error: error.message,
    });
  }
};


// =====================================================
// RESEND OTP
// =====================================================

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified. Please login.",
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Delete old OTP
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send new OTP
    await sendEmail({
      to: email,
      subject: "ShopEase New Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>ShopEase Email Verification</h2>

          <p>Your new verification OTP is:</p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>This OTP will expire in 10 minutes.</p>

          <p>Thank you,<br>ShopEase Team</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
      error: error.message,
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Generate JWT
    const token = generateToken(
      user._id,
      user.role
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};


// =====================================================
// LOGOUT
// =====================================================

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  logout,
};