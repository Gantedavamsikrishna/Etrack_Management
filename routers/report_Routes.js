const express = require("express");

const router = express.Router();

const {
  getReports,
  createReport,
  deleteReport,
  updateReport,
  confirmReport,
} = require("../controller/report_Controller");

router.get("/get", getReports);
router.post("/create", createReport);
router.delete("/delete/:id", deleteReport);
router.put("/update/:id", updateReport);
router.put("/confirm/:id", confirmReport);

module.exports = router;
