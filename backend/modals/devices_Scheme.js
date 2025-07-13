const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceBarcode: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  devicePrice: {
    type: Number,
    required: true,
  },
  deviceModel: {
    type: String,
    required: true,
  },
  deviceStatus: {
    type: String,
    // enum: ["active", "inactive", "maintenance"],
    default: "active",
  },
  deviceLocation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Device", deviceSchema);
