const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
  adminImage: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", admin);
module.exports = Admin;
