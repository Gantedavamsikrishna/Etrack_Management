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
  confirmed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);