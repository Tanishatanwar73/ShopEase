const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateAIResponse = async (
  prompt,
  products = [],
  image = null
) => {
  try {
    // Convert MongoDB products into simple data
    const productData = products.map((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      isDeal: product.isDeal,
      isBestSeller: product.isBestSeller,
    }));

    const contents = [];

    // Product information from MongoDB
    contents.push({
      text: `
You are the AI Shopping Assistant for ShopEase.

You help users find and understand products available
on the ShopEase website.

IMPORTANT RULES:
1. Only recommend products from the provided ShopEase product data.
2. Do not invent products.
3. Do not invent prices.
4. Do not invent stock information.
5. Use the exact product information provided.
6. If there is no suitable product, say that no matching product was found.
7. Keep your response clear and useful.

User question:
${prompt}

ShopEase product data:
${JSON.stringify(productData, null, 2)}
`,
    });

    // Add uploaded image if available
    if (image) {
      contents.push({
        inlineData: {
          mimeType: image.mimetype,
          data: image.buffer.toString("base64"),
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
};

module.exports = {
  generateAIResponse,
};