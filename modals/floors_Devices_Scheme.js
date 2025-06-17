const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomDeviceSchema = new Schema({
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
    enum: ["working", "not working", "under maintenance"], // optional
    required: true,
  },
  count: {
    type: Number,
    required: true,
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

// 3. Wing Schema inside a Floor
const wingSchema = new Schema({
  wingName: {
    type: String,
    enum: ["Left Wing", "Right Wing"],
    required: true,
  },
  rooms: [roomSchema],
});

// 4. Floor Schema (main document)
const floorSchema = new Schema({
  floorName: {
    type: String,
    required: true,
  },

  wings: [wingSchema],
});

// Model export
module.exports = mongoose.model("Floor", floorSchema);
