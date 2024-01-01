const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const uploadPhoto = require("../utils/uploadPhoto");

const prisma = new PrismaClient();
const Product = prisma.product;

exports.addProducts = catchAsync(async (req, res, next) => {
  const productsList = req.body;
  for (var i = 0; i < productsList.length; i++)
    if (
      !productsList[i].name ||
      !productsList[i].price ||
      !productsList[i].company
    ) {
      next(
        new AppError(
          "الرجاء ادخال الاسم والسعر والشركة المصنعة الخاصة بالمنتج",
          400
        )
      );
    }
  const products = await Product.createMany({ data: req.body });
  res
    .status(200)
    .json({ status: "success", message: "تم اضافة المنتجات بنجاح" });
});

exports.addPhoto = catchAsync(async (req, res, next) => {
  const productsList = req.body;
  for (var i = 0; i < productsList.length; i++)
    if (req.body[i].photo) {
      try {
        const filename = await uploadPhoto(req.body[i].photo);
        req.body[i].photo =
          "https://smallcrm.onrender.com/api/products/img/" + filename;
      } catch (err) {
        req.body[i].photo =
          "https://smallcrm.onrender.com/api/products/img/default-image.jpg";
      }
    } else {
      req.body[i].photo =
        "https://smallcrm.onrender.com/api/products/img/default-image.jpg";
    }
  next();
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findMany();
  res.status(200).json({ status: "success", products });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!product) {
    next(new AppError("عذرا لا يوجد منتج بهذا المعرف", 400));
  }
  res.status(200).json({ status: "success", product });
});
exports.getImage = catchAsync(async (req, res, next) => {});

exports.updateProduct = catchAsync(async (req, res, next) => {
  if (!req.body.name && !req.body.price && !req.body.company) {
    next(
      new AppError(
        "الرجاء ادخال الاسم او السعر او الشركة المراد تعديلها للمنتج",
        400
      )
    );
  }

  const product = await Product.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!product) {
    next(new AppError("عذرا لا يوجد منتج بهذا المعرف", 400));
  }
  Product.update({
    where: { id: parseInt(req.params.id) },
    data: req.body,
  });
  res
    .status(200)
    .json({ status: "success", message: "تم تحديث بيانات العميل بنجاح" });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!product) {
    next(new AppError("عذرا لا يوجد منتج بهذا المعرف", 400));
  }
  await Product.delete({ where: { id: parseInt(req.params.id) } });
  res.status(200).json({ status: "success", message: "تم حذف المنتج بنجاح" });
});
