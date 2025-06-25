const express = require("express");
const router = express.Router();

const {
  // createFloor,
  getAllFloors,
  filterByfloors,
  getDeviceById,
  createOrUpdateFloor,
  createDynamicFloor,
} = require("../controller/floor_Device_Controller");

router.post("/createFloor", createOrUpdateFloor);
router.get("/getAllFloors", getAllFloors);
router.get("/filterByfloors", filterByfloors);
router.get("/device/:deviceBarcode", getDeviceById);
router.post("/createDynamicFloor", createDynamicFloor);
// router.put("/update-location-status", updateDeviceLocationAndStatus);

module.exports = router;
