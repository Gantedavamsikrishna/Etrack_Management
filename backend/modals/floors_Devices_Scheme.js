const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 1. Device Schema inside a Room
const roomDeviceSchema = new Schema({
  deviceBarcode: {
    type: String,
    required: true,
  },
  devicePrice: {
    type: Number,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  deviceModel: {
    type: String,
    required: true,
  },
  deviceStatus: {
    type: String,
    required: true,
    // Optionally: add validation or enum here
    // enum: ["working", "not working", "under maintenance"]
  },
});

// 2. Room Schema inside a Wing
const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
  },
  devices: [roomDeviceSchema],
});

// 3. Wing Schema inside a Floor (✅ Removed enum restriction)
const wingSchema = new Schema({
  wingName: {
    type: String,
    required: true,
  },
  rooms: [roomSchema],
});

// 4. Floor Schema (main document)
const floorSchema = new Schema({
  floorName: {
    type: String,
    required: true,
    unique: true, // Optional: ensure no duplicate floor names
  },
  wings: [wingSchema],
});

// Export the model
module.exports = mongoose.model("Floor", floorSchema);
