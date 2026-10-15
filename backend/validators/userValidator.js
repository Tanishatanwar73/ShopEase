const validateProfile = (
  req,
  res,
  next
) => {

  const {
    name,
    phone,
    address,
  } = req.body;

  if (
    name === undefined &&
    phone === undefined &&
    address === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide information to update.",
    });
  }

  if (
    name !== undefined &&
    name.trim().length < 2
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Name must be at least 2 characters.",
    });
  }

  next();
};


const validateChangePassword = (
  req,
  res,
  next
) => {

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

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "New password must be at least 6 characters.",
    });
  }

  next();
};


module.exports = {
  validateProfile,
  validateChangePassword,
};