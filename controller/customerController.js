const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const prisma = new PrismaClient();
const Customer = prisma.customer;
const Sale = prisma.sale;

exports.addCustomers = catchAsync(async (req, res, next) => {
  const customersList = req.body;
  for (var i = 0; i < customersList.length; i++) {
    if (
      !customersList[i].name ||
      !customersList[i].address ||
      !customersList[i].phoneNumber
    ) {
      return next(
        new AppError(
          "الرجاء ادخال الاسم والعنوان ورقم الهاتف الخاص بالعميل",
          400
        )
      );
    }
  }
  await Customer.createMany({ data: req.body });
  res
    .status(200)
    .json({ status: "success", message: "تم اضافة العملاء بنجاح" });
});

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  Object.keys(req.query).forEach((el) => {
    if (el !== "name" && (el !== "phoneNumber") & (el !== "address"))
      delete req.query[el];
    else {
      req.query[el] = {
        contains: req.query[el],
      };
    }
  });
  const customers = await Customer.findMany({
    where: req.query,
    skip,
    take: limit,
  });
  res.status(200).json({ status: "success", customers });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (customer === null) {
    return next(new AppError("عذرا لا يوجد عميل بهذا المعرف", 400));
  }
  res.status(200).json({ status: "success", customer });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {
  if (!req.body.name && !req.body.address && !req.body.phoneNumber) {
    return next(
      new AppError("الرجاء ادخال الاسم والعنوان ورقم الهاتف الخاص بالعميل", 400)
    );
  }
  const customer = await Customer.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  await Customer.update({
    where: { id: parseInt(req.params.id) },
    data: req.body,
  });
  res
    .status(200)
    .json({ status: "success", message: "تم تحديث بيانات العميل بنجاح" });
});

exports.deleteCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!customer) {
    return next(new AppError("عذرا لا يوجد عميل بهذا المعرف", 400));
  }
  await Sale.deleteMany({ where: { customerId: parseInt(req.params.id) } });
  await Customer.delete({ where: { id: parseInt(req.params.id) } });
  res.status(200).json({ status: "success", message: "تم حذف العميل بنجاح" });
});
