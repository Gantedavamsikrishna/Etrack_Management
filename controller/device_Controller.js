const device = require("../modals/devices_Scheme");

// Create a new device
const createDevice = async (req, res) => {
  try {
    const { deviceName, devicePrice, deviceModel, deviceStatus } = req.body;
    const newDevice = new device({
     deviceName, devicePrice, deviceModel, deviceStatus
    });
    await newDevice.save();
    res.status(201).json({
      message: "Device data inserted  successfully",
      device: newDevice,
    });
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// get all devices data
const getAlldevices = async (req, res) => {
  const devices = await device.find();
  console.log(devices);
  res.status(200).json({
    message: "All devices data",
    devices,
  });
};
// get device by id
const getDeviceById = async (req, res) => {
  const { id } = req.params;
  const deviceData = await device.findById(id);
  if (!deviceData) {
    return res.status(404).json({ message: "Device not found" });
  }
  res.status(200).json({
    message: "Device data",
    deviceData,
  });
};
// Update device by id
const updateDeviceById = async (req, res) => {
  const { id } = req.params;
  const { deviceName, devicePrice, deviceModel, deviceStatus } = req.body;
  const updatedDevice = await device.findByIdAndUpdate(
    id,
    { deviceName, devicePrice, deviceModel, deviceStatus },
    { new: true }
  );
  if (!updatedDevice) {
    return res.status(404).json({ message: "Device not found" });
  }
  res.status(200).json({
    message: "Device updated successfully",
    device: updatedDevice,
  });
};

//filter device by status and device name using match aggregation
const filterByName = async (req, res) => {
  try {
    const { deviceName, deviceStatus } = req.query;
    const matchStage = {};

    if (deviceName) {
      matchStage.deviceName = { $regex: deviceName, $options: "i" }; // only if partial match needed
    }

    if (deviceStatus) {
      matchStage.deviceStatus = { $regex: deviceStatus, $options: "i" }; // exact match is faster
    }

    const data = await device.aggregate([{ $match: matchStage }]);

    res.status(200).json(data);
  } catch (er) {
    console.error("Error fetching devices:", er);
    res
      .status(500)
      .json({ message: "Failed to fetch devices", error: er.message });
  }
};
// filter device by status and device name using find
// const filterByName = async (req, res) => {
//   try {
//     const { deviceName, deviceStatus } = req.query;
//     const filter = {};
//     if (deviceName) filter.deviceName = { $regex: deviceName, $options: "i" };
//     if (deviceStatus) filter.deviceStatus = deviceStatus;
//     const data = await device.find(filter);
//     res.status(200).json(data);
//   } catch (er) {
//     console.error("Error fetching devices:", er);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch devices", error: er.message });
//   }
// };

// Export the controller functions
module.exports = {
  createDevice,
  getAlldevices,
  getDeviceById,
  updateDeviceById,
  filterByName,
};
