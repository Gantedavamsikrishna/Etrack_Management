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

const myimagepath = path.join(__dirname, "..", "public", "adminImage");
if (!fs.existsSync(myimagepath)) {
  fs.mkdirSync(myimagepath, { recursive: true });
}

const mystorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, myimagepath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadingImage = multer({ storage: mystorage }).single("adminImage"); // ✅ Must match front-end input name

router.post("/create", uploadingImage, createAdmin);
router.get("/get", getAllAdmin);
router.put("/update/:adminId", uploadingImage, updateAdminById);
router.post("/login", loginAdmin);

module.exports = router;
