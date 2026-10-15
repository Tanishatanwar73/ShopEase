const validateProduct = (
  req,
  res,
  next
) => {

  const {
    name,
    description,
    price,
    category,
    stock,
  } = req.body;

  if (
    !name ||
    !description ||
    price === undefined ||
    !category ||
    stock === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Name, description, price, category and stock are required.",
    });
  }

  if (Number(price) < 0) {
    return res.status(400).json({
      success: false,
      message:
        "Price cannot be negative.",
    });
  }

  if (Number(stock) < 0) {
    return res.status(400).json({
      success: false,
      message:
        "Stock cannot be negative.",
    });
  }

  next();
};


module.exports = validateProduct;