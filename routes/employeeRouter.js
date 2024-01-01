const express = require("express");

const router = express.Router();

const authController = require("../controller/authController.js");
const employeeController = require("../controller/employeeController.js");

router
  .route("/")
  .get(authController.protect, employeeController.getAllEmployees)
  .post(authController.protect, employeeController.addEmployee);

router
  .route("/:id")
  .put(authController.protect, employeeController.updateEmployee)
  .delete(authController.protect, employeeController.deleteEmployee)
  .get(authController.protect, employeeController.getEmployee);
module.exports = router;
