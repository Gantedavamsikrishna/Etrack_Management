const express = require("express");

const router = express.Router();

const {
  getReports,
  createReport,
  deleteReport,
  updateReport,
} = require("../controller/report_Controller");

router.get("/get", getReports);
router.post("/create", createReport);
router.delete("/delete", deleteReport);
router.put("/update/:id", updateReport);

module.exports = router;
