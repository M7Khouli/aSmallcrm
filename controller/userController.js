const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const prisma = new PrismaClient();
const User = prisma.user;
