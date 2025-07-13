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
router.get("/get/:deviceBarcode", getDeviceById);
router.put("/update/:deviceBarcode", updateDeviceById);
router.get("/filter", filterByName);

module.exports = router;
