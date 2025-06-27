const Floor = require("../modals/floors_Devices_Scheme");

// Create or Update a Floor with wings/rooms/devices
const createOrUpdateFloor = async (req, res) => {
  try {
    const { floorName, wingName, roomName, devices } = req.body;

    if (!floorName || !wingName || !roomName || !devices || !Array.isArray(devices)) {
      return res.status(400).json({
        message: "All fields are required and devices must be an array.",
      });
    }

    let floor = await Floor.findOne({ floorName });

    if (!floor) {
      floor = new Floor({
        floorName,
        wings: [
          {
            wingName,
            rooms: [{ roomName, devices }],
          },
        ],
      });
      await floor.save();
      return res.status(201).json({
        message: "New floor, wing, room, and devices created.",
        floor,
      });
    }

    let wing = floor.wings.find((w) => w.wingName === wingName);
    if (!wing) {
      floor.wings.push({ wingName, rooms: [{ roomName, devices }] });
    } else {
      let room = wing.rooms.find((r) => r.roomName === roomName);
      if (!room) {
        wing.rooms.push({ roomName, devices });
      } else {
        room.devices.push(...devices);
      }
    }

    await floor.save();

    res.status(200).json({
      message: "Floor updated successfully.",
      floor,
    });
  } catch (error) {
    console.error("Error updating/creating floor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Floors
const getAllFloors = async (req, res) => {
  try {
    const floors = await Floor.find();
    res.status(200).json(floors);
  } catch (error) {
    console.error("Error fetching floors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Filter Floors by multiple nested parameters
const filterByfloors = async (req, res) => {
  try {
    const { floorName, wingName, roomName, deviceName, deviceStatus } = req.query;

    let floorFilter = {};
    if (floorName) floorFilter.floorName = { $regex: floorName, $options: "i" };

    const floors = await Floor.find(floorFilter).lean();

    const filteredFloors = floors.map((floor) => {
      let wings = floor.wings || [];

      if (wingName) {
        wings = wings.filter((w) =>
          w.wingName?.toLowerCase().includes(wingName.toLowerCase())
        );
      }

      wings = wings.map((wing) => {
        let rooms = wing.rooms || [];

        if (roomName) {
          rooms = rooms.filter((r) =>
            r.roomName?.toLowerCase().includes(roomName.toLowerCase())
          );
        }

        rooms = rooms.map((room) => {
          let devices = room.devices || [];

          if (deviceName) {
            devices = devices.filter((d) =>
              d.deviceName?.toLowerCase().includes(deviceName.toLowerCase())
            );
          }

          if (deviceStatus) {
            devices = devices.filter(
              (d) => d.deviceStatus?.toLowerCase() === deviceStatus.toLowerCase()
            );
          }

          return { ...room, devices };
        });

        return { ...wing, rooms };
      });

      return { ...floor, wings };
    });

    res.status(200).json(filteredFloors);
  } catch (err) {
    console.error("Error filtering floors:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get Device by Barcode
const getDeviceById = async (req, res) => {
  const { deviceBarcode } = req.params;
  try {
    const result = await Floor.aggregate([
      { $unwind: "$wings" },
      { $unwind: "$wings.rooms" },
      { $unwind: "$wings.rooms.devices" },
      {
        $match: {
          "wings.rooms.devices.deviceBarcode": deviceBarcode,
        },
      },
      {
        $project: {
          _id: 0,
          floorName: 1,
          floorNumber: 1,
          wingName: "$wings.wingName",
          roomName: "$wings.rooms.roomName",
          device: "$wings.rooms.devices",
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.status(200).json({
      message: "Device found",
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create dynamic floor with wings and empty rooms
const createDynamicFloor = async (req, res) => {
  try {
    const { floorName, wings } = req.body;

    if (!floorName || !Array.isArray(wings) || wings.length === 0) {
      return res.status(400).json({
        message: "floorName and wings (with rooms) are required.",
      });
    }

    const existingFloor = await Floor.findOne({ floorName });
    if (existingFloor) {
      return res.status(400).json({
        message: "A floor with this name already exists.",
      });
    }

    const floorData = {
      floorName,
      wings: wings.map((wing) => ({
        wingName: wing.wingName,
        rooms: (wing.rooms || []).map((roomName) => ({
          roomName,
          devices: [],
        })),
      })),
    };

    const newFloor = new Floor(floorData);
    const savedFloor = await newFloor.save();

    res.status(201).json({
      message: "Dynamic floor created successfully.",
      floor: savedFloor,
    });
  } catch (error) {
    console.error("Error creating dynamic floor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ NEW: Update floor name and wings
const updateFloorAndWings = async (req, res) => {
  const { oldFloorName, newFloorName, updatedWings } = req.body;

  console.log("Received payload:", req.body); // Log the payload

  if (!oldFloorName || !newFloorName || !Array.isArray(updatedWings)) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    const floor = await Floor.findOne({ floorName: oldFloorName });

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    floor.floorName = newFloorName;
    floor.wings = updatedWings;

    const updatedFloor = await floor.save();

    return res.status(200).json({ message: "Floor and wings updated", floor: updatedFloor });
  } catch (error) {
    console.error("Error updating floor:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ NEW: Delete floor
const deleteFloor = async (req, res) => {
  const { floorName } = req.params;
  try {
    const deleted = await Floor.findOneAndDelete({ floorName });
    if (!deleted) {
      return res.status(404).json({ message: "Floor not found" });
    }
    res.status(200).json({ message: "Floor deleted successfully." });
  } catch (error) {
    console.error("Error deleting floor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update device location and status
const updateDeviceLocationAndStatus = async (req, res) => {
  const { deviceBarcode, newFloorName, newWingName, newRoomName, newStatus } = req.body;

  if (!deviceBarcode || !newFloorName || !newWingName || !newRoomName || !newStatus) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const floors = await Floor.find();
    let sourceFloor, sourceWing, sourceRoom, foundDevice;

    for (const floor of floors) {
      for (const wing of floor.wings) {
        for (const room of wing.rooms) {
          const deviceIndex = room.devices.findIndex((d) => d.deviceBarcode === deviceBarcode);
          if (deviceIndex !== -1) {
            foundDevice = room.devices[deviceIndex];
            sourceFloor = floor;
            sourceRoom = room;
            room.devices.splice(deviceIndex, 1);
            break;
          }
        }
        if (foundDevice) break;
      }
      if (foundDevice) break;
    }

    if (!foundDevice) {
      return res.status(404).json({ message: "Device not found" });
    }

    foundDevice.deviceStatus = newStatus;

    const targetFloor = floors.find((f) => f.floorName === newFloorName);
    const targetWing = targetFloor?.wings.find((w) => w.wingName === newWingName);
    const targetRoom = targetWing?.rooms.find((r) => r.roomName === newRoomName);

    if (!targetRoom) {
      return res.status(404).json({ message: "Target room not found" });
    }

    targetRoom.devices.push(foundDevice);

    if (sourceFloor._id.toString() !== targetFloor._id.toString()) {
      await sourceFloor.save();
    }
    await targetFloor.save();

    res.status(200).json({ message: "Device moved and status updated successfully." });
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrUpdateFloor,
  getAllFloors,
  filterByfloors,
  getDeviceById,
  createDynamicFloor,
  updateDeviceLocationAndStatus,
  updateFloorAndWings, 
  deleteFloor, 
};
