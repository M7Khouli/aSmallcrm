const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const prisma = new PrismaClient();
const Employee = prisma.employee;

exports.addEmployee = catchAsync(async (req, res, next) => {
  const employee = req.body;
  if (!employee.name || !employee.address || !employee.phoneNumber) {
    return next(
      new AppError("الرجاء ادخال الاسم والعنوان ورقم الهاتف الخاص بالموظف", 400)
    );
  }
  await Employee.createMany({ data: req.body });
  res.status(200).json({ status: "success", message: "تم اضافة الموظف بنجاح" });
});

exports.getAllEmployees = catchAsync(async (req, res, next) => {
  const employees = await Employee.findMany();
  res.status(200).json({ status: "success", employees });
});

exports.getEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (employee === null) {
    return next(new AppError("عذرا لا يوجد موظف بهذا المعرف", 400));
  }
  res.status(200).json({ status: "success", employee });
});

exports.updateEmployee = catchAsync(async (req, res, next) => {
  if (!req.body.name && !req.body.address && !req.body.phoneNumber) {
    return next(
      new AppError("الرجاء ادخال الاسم والعنوان ورقم الهاتف الخاص بالموظف", 400)
    );
  }

  const employee = await Employee.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!employee) {
    return next(new AppError("عذرا لا يوجد موظف بهذا المعرف", 400));
  }
  await Employee.update({
    where: { id: parseInt(req.params.id) },
    data: req.body,
  });
  res
    .status(200)
    .json({ status: "success", message: "تم تحديث بيانات الموظف بنجاح" });
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!employee) {
    return next(new AppError("عذرا لا يوجد موظف بهذا المعرف", 400));
  }
  await Employee.delete({ where: { id: parseInt(req.params.id) } });
  res.status(200).json({ status: "success", message: "تم حذف الموظف بنجاح" });
});
