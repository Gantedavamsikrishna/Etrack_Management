const express = require("express");
const router = express.Router();

const {
  getAllFloors,
  filterByfloors,
  getDeviceById,
  createOrUpdateFloor,
  updateDeviceLocationAndStatus
} = require("../controller/floor_Device_Controller");

router.post("/createFloor", createOrUpdateFloor);
router.get("/getAllFloors", getAllFloors);
router.get("/filterByfloors", filterByfloors);
router.get("/device/:deviceBarcode", getDeviceById);
router.put("/update-location-status", updateDeviceLocationAndStatus);

module.exports = router;
