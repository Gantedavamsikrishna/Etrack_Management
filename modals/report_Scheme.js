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
  status: {
    type: String,
    enum: ["new", "confirmed", "resolved"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);