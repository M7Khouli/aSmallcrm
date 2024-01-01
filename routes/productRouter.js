const express = require("express");

const router = express.Router();

const authController = require("../controller/authController.js");
const productController = require("../controller/productController.js");

router
  .route("/")
  .get(authController.protect, productController.getAllProducts)
  .post(authController.protect, productController.addProducts);

router
  .route("/:id")
  .put(authController.protect, productController.updateProduct)
  .delete(authController.protect, productController.deleteProduct)
  .get(authController.protect, productController.getProduct);
module.exports = router;
