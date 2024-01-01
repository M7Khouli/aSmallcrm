const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const app = express();

app.use(cors());

const globalErrorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");
const userRouter = require("./routes/userRouter");
const customersRouter = require("./routes/customerRouter");
const productsRouter = require("./routes/productRouter");
const salesRouter = require("./routes/saleRouter");

app.use(express.static("public/"));

app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// for parsing multipart/form-data
app.use(upload.array());

app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/customers", customersRouter);
app.use("/api/products", productsRouter);
app.use("/api/sales", salesRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cannot found ${req.originalUrl} on this server !`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
