const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const prisma = new PrismaClient();
const Customer = prisma.customer;

exports.addCustomers = catchAsync((req, res, next) => {
  if (!req.body.name || !req.body.address || !req.body.phoneNumber) {
    next(
      new AppError("الرجاء ادخال الاسم والعنوان ورقم الهاتف الخاص بالعميل", 400)
    );
  }
  const customers = Customer.createMany({ data: req.body });
  res
    .status(200)
    .json({ status: "success", message: "تم اضافة العملاء بنجاح" });
});

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.findMany();
  res.status(200).json({ status: "success", customers });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!customer) {
    next(new AppError("عذرا لا يوجد عميل بهذا المعرف", 400));
  }
  res.status(200).json({ status: "success", customer });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {
  if (!req.body.name && !req.body.address && !req.body.phoneNumber) {
    next(
      new AppError("الرجاء ادخال الاسم والعنوان ورقم الهاتف الخاص بالعميل", 400)
    );
  }

  const customer = await Customer.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!customer) {
    next(new AppError("عذرا لا يوجد عميل بهذا المعرف", 400));
  }
  Customer.update({
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
    next(new AppError("عذرا لا يوجد عميل بهذا المعرف", 400));
  }
  await Customer.delete({ where: { id: parseInt(req.params.id) } });
  res.status(200).json({ status: "success", message: "تم حذف العميل بنجاح" });
});
