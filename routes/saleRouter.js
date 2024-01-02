const express = require("express");

const router = express.Router();

const authController = require("../controller/authController.js");
const saleController = require("../controller/saleController.js");

router
  .route("/")
  .post(authController.protect, saleController.addSaleTransaction)
  .get(authController.protect, saleController.getAllSaleTransaction);

module.exports = router;
