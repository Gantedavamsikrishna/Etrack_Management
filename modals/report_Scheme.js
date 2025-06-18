const { mongoose } = require("mongoose");

const reportSchema = new mongoose.Schema({
  deviceBarcode: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  deviceStatus: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "active",
  },
});

module.exports = mongoose.model("report", reportSchema);
