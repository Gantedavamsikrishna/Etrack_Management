const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmin,
  updateAdminById,
  loginAdmin,
} = require("../controller/admin_Controller");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure image folder exists
const myimagepath = path.join(__dirname, "..", "public", "adminImage");
if (!fs.existsSync(myimagepath)) {
  fs.mkdirSync(myimagepath, { recursive: true });
}

// Multer storage configuration
const mystorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, myimagepath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer file filter for image types
const imageFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)"));
  }
};

const uploadingImage = multer({
  storage: mystorage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: imageFilter,
}).single("adminImage"); 
router.post("/create", uploadingImage, createAdmin);
router.get("/get", getAllAdmin);
router.put("/update/:adminId", uploadingImage, updateAdminById);
router.post("/login", loginAdmin);

module.exports = router;
