const express = require("express");
const multer = require("multer");

const { askAI } = require("../controllers/aiController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/ask",
  upload.single("image"),
  askAI
);

module.exports = router;