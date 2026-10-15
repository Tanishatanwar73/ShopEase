const Product = require("../models/Product");

const {
  generateAIResponse,
} = require("../services/geminiService");

const getUnavailableProductMessage = (prompt = "") => {
  const trimmed = String(prompt || "").trim();

  if (!trimmed) {
    return "This product is not available in our store right now. We will add it soon.";
  }

  return "This product is not available in our store right now. We will add it soon.";
};

const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("AI Prompt:", prompt);

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const products = await Product.find({
      isActive: true,
    }).limit(50);

    console.log(
      "Products found:",
      products.length
    );

    const image = req.file || null;

    const answer = await generateAIResponse(
      prompt,
      products,
      image
    );

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(
      "AI Controller Error:",
      error
    );

    const message =
      error &&
      (error.message || "").toLowerCase().includes("unavailable")
        ? getUnavailableProductMessage(req?.body?.prompt)
        : error.message || "Failed to get AI response";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

module.exports = {
  askAI,
};
