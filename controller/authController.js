const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const User = prisma.user;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const singToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
  return token;
};

const sendToken = (user, statusCode, res) => {
  const token = singToken(user.id);
  //hide the password
  user.password = undefined;
  res.status(statusCode).json({
    status: "Success",
    message: "تم تسجيل الدخول بنجاح",
    token,
    user,
  });
};

const comparePassword = async function (candidatePassword, currentPassword) {
  return bcrypt.compare(candidatePassword, currentPassword);
};
exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
      new AppError("الرجاء ارفاق البريد الالكتروني وكلمة المرور", 400)
    );
  }
  const user = await User.findUnique({ where: { email: req.body.email } });
  if (!user || !(await comparePassword(req.body.password, user.password)))
    return next(new AppError("خطأ في البريد الالكتروني او كلمة المرور", 401));

  sendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(new AppError("Unauthorized", 401));
  const token = req.headers.authorization.split(" ")[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user)
    return next(new AppError("Unauthorized, user does not exist", 401));
  req.user = user;
  next();
});

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("Unauthorized, This route require a high level role", 401)
      );
    next();
  };
};
