const express = require("express");
const router = express.Router();

const {
  getAllFloors,
  filterByfloors,
  getDeviceById,
  createOrUpdateFloor,
  updateDeviceLocationAndStatus,
  createDynamicFloor,
  updateFloorAndWings,            
  deleteFloor,                   
} = require("../controller/floor_Device_Controller");
router.post("/createFloor", createOrUpdateFloor);
router.post("/createDynamicFloor", createDynamicFloor);
router.get("/getAllFloors", getAllFloors);
router.get("/filterByfloors", filterByfloors);
router.get("/device/:deviceBarcode", getDeviceById);
router.put("/update-location-status", updateDeviceLocationAndStatus);
router.put("/updateFloorandwing", updateFloorAndWings);
router.delete("/deleteFloor/:floorName", deleteFloor);
module.exports = router;
