const express = require("express");
const router = express.Router();

const {
  createFloor,
  getAllFloors,
  filterByfloors,
} = require("../controller/floor_Device_Controller");

router.post("/createFloor", createFloor);
router.get("/getAllFloors", getAllFloors);
router.get("/filterByfloors", filterByfloors);

module.exports = router;
