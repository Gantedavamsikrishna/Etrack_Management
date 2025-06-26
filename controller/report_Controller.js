const report = require("../modals/report_Scheme");

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const newReport = new report(req.body);
    const savedReport = await newReport.save();

    const io = req.app.get("io");
    if (io) {
      console.log(" Report saved, emitting to admin:", savedReport);
      io.emit("reportAlert", savedReport);
    }

    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await report.find();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a report by ID
exports.deleteReport = async (req, res) => {
  try {
    const deletedReport = await report.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a report by ID
exports.updateReport = async (req, res) => {
  try {
    const updatedReport = await report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
