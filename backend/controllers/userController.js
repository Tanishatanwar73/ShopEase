const bcrypt = require("bcryptjs");

const User = require("../models/User");


// ========================================
// GET OWN PROFILE
// ========================================

const getProfile = async (req, res) => {
  try {
    const user =
      await User.findById(req.user.userId)
        .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "Get profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get profile.",
    });
  }
};


// ========================================
// UPDATE OWN PROFILE
// ========================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
    } = req.body;

    const user =
      await User.findById(
        req.user.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
    });

  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};


// ========================================
// CHANGE PASSWORD
// ========================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current and new passwords are required.",
      });
    }

    const user =
      await User.findById(
        req.user.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};


// ========================================
// ADMIN - GET ALL USERS
// ========================================

const getUsers = async (req, res) => {
  try {
    const users =
      await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};


// ========================================
// ADMIN - GET USER DETAILS
// ========================================

const getUserById = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
};