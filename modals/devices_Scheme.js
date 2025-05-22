const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
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
    enum: ["active", "inactive", "maintenance"],
    default: "active",
  },
});

module.exports = mongoose.model("Device", deviceSchema);
