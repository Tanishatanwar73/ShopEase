const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err.stack);

  const statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message:
      err.message ||
      "Something went wrong.",
  });
};

module.exports = errorMiddleware;