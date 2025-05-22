const express = require("express");
const router = express.Router();

const {
  createDevice,
  getAlldevices,
  getDeviceById,
  updateDeviceById,
  filterByName,
} = require("../controller/device_Controller");

// Define the routes for device operations
router.post("/create", createDevice);
router.get("/get", getAlldevices);
router.get("/get/:id", getDeviceById);
router.put("/update/:id", updateDeviceById);
router.get("/filter", filterByName);

module.exports = router;
