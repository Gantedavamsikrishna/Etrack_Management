const express = require("express");
const router = express.Router();

const {
  createFloor,
  getAllFloors,
  filterByfloors,
  getDeviceById,
  updateDeviceLocationAndStatus,
} = require("../controller/floor_Device_Controller");

router.post("/createFloor", createFloor);
router.get("/getAllFloors", getAllFloors);
router.get("/filterByfloors", filterByfloors);
router.get("/device/:deviceBarcode", getDeviceById);
router.put("/update-location-status", updateDeviceLocationAndStatus);

module.exports = router;
