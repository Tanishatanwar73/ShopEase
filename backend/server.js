
require("dotenv").config();

// ========================================
// IMPORT PACKAGES
// ========================================
const express = require("express");
const cors = require("cors");

// ========================================
// DATABASE
// ========================================
const connectDB = require("./config/db");

// ========================================
// ROUTES
// ========================================
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const aiRoutes = require("./routes/aiRoutes");

// ========================================
// ERROR MIDDLEWARE
// ========================================
const errorMiddleware = require("./middleware/errorMiddleware");

// ========================================
// CREATE EXPRESS APP
// ========================================
const app = express();

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// TEST ROUTE
// ========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopEase Backend is running!",
  });
});

// ========================================
// API ROUTES
// ========================================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/ai", aiRoutes);

// ========================================
// ERROR MIDDLEWARE
// ========================================
app.use(errorMiddleware);

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Wait for MongoDB before accepting requests.
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ShopEase Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
