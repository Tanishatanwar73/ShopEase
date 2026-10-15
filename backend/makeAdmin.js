require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "sathakj3214@gmail.com";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      process.exit(1);
    }

    user.role = "admin";

    await user.save();

    console.log("================================");
    console.log("User is now ADMIN");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("================================");

    process.exit(0);

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

makeAdmin();

