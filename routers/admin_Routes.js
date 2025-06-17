const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmin,
  updateAdminById,
  loginAdmin,
} = require("../controller/admin_Controller");

// Define the routes for admin operations
router.post("/create", createAdmin);
router.get("/get", getAllAdmin);
router.put("/update/:adminId", updateAdminById);
router.post("/login", loginAdmin);

module.exports = router;
