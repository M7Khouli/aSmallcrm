const AppError = require("../utils/appError");

const handelTokenExpireError = () => {
  return new AppError(
    "انتهت صلاحية تسجيل الدخول , يرجى اعادة تسجيل الدخول",
    401
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleTokenInvalidError = (err) => {
  return new AppError("حدث خطأ, يرجى اعادة تسجيل الدخول", 401);
};

const handelFalsePhotoError = (err) => {
  return new AppError("لاتوجد صورة على هذا الرابط", 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "some big error has happened",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (err.name === "TokenExpiredError") error = handelTokenExpireError();
    if (err.name === "JsonWebTokenError") error = handleTokenInvalidError();
    if (err.errno === -2) error = handelFalsePhotoError();

    sendErrorProd(error, res);
  }
};
