const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const prisma = new PrismaClient();
const Sale = prisma.sale;

exports.addSaleTransaction = catchAsync(async (req, res, next) => {
  const sale = await Sale.create({ data: req.body });
  res.status(200).json({
    status: "success",
    message: "تم اضافة عملية البيع بنجاح",
    data: sale,
  });
});
