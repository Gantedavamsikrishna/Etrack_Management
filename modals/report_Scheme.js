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
    default: "active",
  },
});

module.exports = mongoose.model("report", reportSchema);
