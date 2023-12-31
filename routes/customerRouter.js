const express = require("express");

const router = express.Router();

const authController = require("../controller/authController.js");
const customerController = require("../controller/customerController.js");

router
  .route("/")
  .get(authController.protect, customerController.getAllCustomers)
  .post(authController.protect, customerController.addCustomers);

router
  .route("/:id")
  .patch(authController.protect, customerController.updateCustomer)
  .delete(authController.protect, customerController.deleteCustomer)
  .get(authController.protect, customerController.getCustomer);
module.exports = router;
