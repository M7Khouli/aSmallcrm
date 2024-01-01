const express = require("express");

const router = express.Router();

const authController = require("../controller/authController.js");
const productController = require("../controller/productController.js");
const upload = require("../utils/uploadPhoto.js");

router
  .route("/")
  .get(authController.protect, productController.getAllProducts)
  .post(
    authController.protect,
    productController.addPhoto,
    productController.addProducts
  );

router
  .route("/:id")
  .put(authController.protect, productController.updateProduct)
  .delete(authController.protect, productController.deleteProduct)
  .get(authController.protect, productController.getProduct)
  .post(authController.protect, productController.updateProduct);

router
  .route("/img/:id")
  .get(authController.protect, productController.getImage);
module.exports = router;
