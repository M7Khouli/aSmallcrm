const multer = require("multer");
const path = require("path");
const AppError = require("../utils/appError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`); // the file name is his date of creation
  },
});

const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("عذرا , صيغة الصورة غير صحيحة", 400));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB size limit
  fileFilter: fileFilter,
});

module.exports = upload;
