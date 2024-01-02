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

  const customer = await Customer.findUnique({
    where: { id: req.body.customerId },
  });

  if (!customer) {
    return next(new AppError("الرجاء ادخل معرف صحيح للزبون", 400));
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
  const sales =
    await prisma.$queryRaw`SELECT s.id,s.createdAt,s.totalPrice,s.quantity, c.name AS customerName, p.name AS productName
        FROM Sale s
        INNER JOIN Customer c ON s.customerId = c.id
        INNER JOIN Product p ON s.productId = p.id`;
  res.status(200).json({
    status: "success",
    sales,
  });
});

exports.deleteSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!sale) {
    return next(new AppError("عذرا لا يوجد عملية بيع بهذا المعرف", 400));
  }
  await Sale.delete({ where: { id: parseInt(req.params.id) } });
  res
    .status(200)
    .json({ status: "success", message: "تم حذف عملية البيع بنجاح" });
});
