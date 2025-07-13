const device = require("../modals/devices_Scheme");

// Create a new device
const createDevice = async (req, res) => {
  try {
    const {
      deviceBarcode,
      deviceName,
      devicePrice,
      deviceModel,
      deviceStatus,
      deviceLocation,
    } = req.body;
    const newDevice = new device({
      deviceBarcode,
      deviceName,
      devicePrice,
      deviceModel,
      deviceLocation,
      deviceStatus,
    });
    await newDevice.save();
    res.status(201).json({
      message: "Device data inserted successfully",
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
// get device by deviceBarcode
const getDeviceById = async (req, res) => {
  const { deviceBarcode } = req.params;
  try {
    const deviceData = await device.findOne({ deviceBarcode });
    if (!deviceData) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.status(200).json({
      message: "Device data",
      deviceData,
    });
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Update device by id
const updateDeviceById = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body is missing or empty" });
  }
  const { deviceBarcode } = req.params;
  const { deviceName, devicePrice, deviceModel, deviceStatus, deviceLocation } =
    req.body;
  const updatedDevice = await device.findOneAndUpdate(
    { deviceBarcode },
    {
      deviceName,
      devicePrice,
      deviceModel,
      deviceStatus,
      deviceLocation,
    },
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
    const { deviceBarcode, deviceStatus } = req.query;
    const matchStage = {};

    if (deviceName) {
      matchStage.deviceBarcode = { $regex: deviceBarcode, $options: "i" }; // only if partial match needed
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
