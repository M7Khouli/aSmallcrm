const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const prisma = new PrismaClient();
const Sale = prisma.sale;
const Product = prisma.product;
const Customer = prisma.customer;

exports.addSaleTransaction = catchAsync(async (req, res, next) => {
  if (!req.body.productId || !req.body.customerId || !req.body.quantity) {
    return next(
      new AppError("الرجاء ادخل معرف الزبون والمنتج وكميته لاتمام العملية", 400)
    );
  }
  req.body.productId = parseInt(req.body.productId);
  req.body.customerId = parseInt(req.body.customerId);
  const product = await Product.findUnique({
    where: { id: req.body.productId },
  });

  if (!product) {
    return next(new AppError("الرجاء ادخل معرف صحيح للمنتج", 400));
  }
  req.body.totalPrice =
    parseFloat(req.body.quantity) * parseFloat(product.price);
  const sale = await Sale.create({ data: req.body });
  res.status(200).json({
    status: "success",
    message: "تم اضافة عملية البيع بنجاح",
    data: sale,
  });
});

exports.getAllSaleTransaction = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  Object.keys(req.query).forEach((el) => {
    if (
      el !== "customerName" &&
      (el !== "productName") & (el !== "totalPrice") &&
      el !== "quantity"
    )
      delete req.query[el];
    else {
      if (el === "totalPrice" || el === "quantity") {
        if (isNaN(req.query[el]))
          return next(
            new AppError("please provide a valid totalPrice or quantity", 400)
          );
        if (el === "totalPrice") {
          req.query[el] = {
            equals: parseFloat(req.query[el]),
          };
        } else {
          req.query[el] = {
            equals: parseInt(req.query[el]),
          };
        }
      } else {
        req.query[el] = {
          contains: req.query[el],
        };
      }
    }
  });
  const sales = await Sale.findMany({
    include: {
      product: {
        select: {
          name: true,
        },
      },
      customer: {
        select: {
          name: true,
        },
      },
    },
    where: {
      quantity: req.query.quantity,
      totalPrice: req.query.totalPrice,
      customer: { name: req.query.customerName },
      product: { name: req.query.productName },
    },
    skip,
    take: limit,
  });
  res.status(200).json({
    status: "success",
    sales,
  });
});

exports.deleteSale = catchAsync(async (req, res, next) => {
  await Sale.delete({ where: { id: parseInt(req.params.id) } });
  res
    .status(200)
    .json({ status: "success", message: "تم حذف عملية البيع بنجاح" });
});
