const Floor = require("../modals/floors_Devices_Scheme");

// Create a new floor
const createFloor = async (req, res) => {
  try {
    const { floorName, wings } = req.body;
    const newFloor = new Floor({
      floorName,
      wings,
    });
    await newFloor.save();
    res.status(201).json({
      message: "Floor data inserted successfully",
      floor: newFloor,
    });
  } catch (error) {
    console.error("Error creating floor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//get all floors data
const getAllFloors = async (req, res) => {
  try {
    const floors = await Floor.find();
    res.status(200).json(floors);
  } catch (error) {
    console.error("Error fetching floors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// filter floors by name and wings and rooms and devices
const filterByfloors = async (req, res) => {
  try {
    const { floorName, wingName, roomName, deviceName, deviceStatus } =
      req.query;

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
              (d) =>
                d.deviceStatus?.toLowerCase() === deviceStatus.toLowerCase()
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
    console.error("Error fetching floors:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch floors", error: err.message });
  }
};
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

// Controller to update location and status of a device

const updateDeviceLocationAndStatus = async (req, res) => {
  const { deviceBarcode, newFloorName, newWingName, newRoomName, newStatus } =
    req.body;

  if (
    !deviceBarcode ||
    !newFloorName ||
    !newWingName ||
    !newRoomName ||
    !newStatus
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Find the device in any floor
    const floorDoc = await Floor.findOne({
      "wings.rooms.devices.deviceBarcode": deviceBarcode,
    });

    if (!floorDoc) {
      return res.status(404).json({ message: "Device not found" });
    }

    let foundDevice = null;

    // 2. Remove the device from its current location
    for (const wing of floorDoc.wings) {
      for (const room of wing.rooms) {
        const index = room.devices.findIndex(
          (d) => d.deviceBarcode === deviceBarcode
        );
        if (index !== -1) {
          foundDevice = room.devices[index];
          room.devices.splice(index, 1); // Remove from old room
          break;
        }
      }
    }

    if (!foundDevice) {
      return res
        .status(404)
        .json({ message: "Device found in DB but could not extract" });
    }

    // 3. Update the device status only
    foundDevice.deviceStatus = newStatus;

    // 4. Find the target floor (existing only)
    const targetFloor = await Floor.findOne({ floorName: newFloorName });

    if (!targetFloor) {
      return res
        .status(404)
        .json({ message: "Target floor not found. Cannot move." });
    }

    // 5. Find the target wing
    let targetWing = targetFloor.wings.find((w) => w.wingName === newWingName);
    if (!targetWing) {
      return res
        .status(404)
        .json({ message: "Target wing not found in floor." });
    }

    // 6. Find the target room
    let targetRoom = targetWing.rooms.find((r) => r.roomName === newRoomName);
    if (!targetRoom) {
      return res
        .status(404)
        .json({ message: "Target room not found in wing." });
    }

    // 7. Add the updated device to the new location
    targetRoom.devices.push(foundDevice);

    // 8. Save both documents
    await floorDoc.save(); // Save after removing from old location
    await targetFloor.save(); // Save after inserting into new location

    res
      .status(200)
      .json({ message: "Device location and status updated successfully." });
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateDeviceLocationAndStatus,
};

module.exports = {
  createFloor,
  getAllFloors,
  filterByfloors,
  getDeviceById,
  updateDeviceLocationAndStatus,
};
