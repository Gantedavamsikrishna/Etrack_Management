const Floor = require("../modals/floors_Devices_Scheme");

const createOrUpdateFloor = async (req, res) => {
  try {
    const { floorName, wingName, roomName, devices } = req.body;

    if (
      !floorName ||
      !wingName ||
      !roomName ||
      !devices ||
      !Array.isArray(devices)
    ) {
      return res.status(400).json({
        message: "All fields are required and devices must be an array.",
      });
    }

    // 1. Check if floor exists
    let floor = await Floor.findOne({ floorName });

    if (!floor) {
      // Floor doesn't exist → create new
      floor = new Floor({
        floorName,
        wings: [
          {
            wingName,
            rooms: [
              {
                roomName,
                devices,
              },
            ],
          },
        ],
      });
      await floor.save();
      return res.status(201).json({
        message: "New floor, wing, room, and devices created.",
        floor,
      });
    }

    // 2. Floor exists → check wing
    let wing = floor.wings.find((w) => w.wingName === wingName);
    if (!wing) {
      // Wing not found → add new wing
      floor.wings.push({
        wingName,
        rooms: [
          {
            roomName,
            devices,
          },
        ],
      });
    } else {
      // 3. Wing exists → check room
      let room = wing.rooms.find((r) => r.roomName === roomName);
      if (!room) {
        // Room not found → add new room
        wing.rooms.push({
          roomName,
          devices,
        });
      } else {
        // 4. Room exists → append devices
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

module.exports = {
  createOrUpdateFloor,
  getAllFloors,
  filterByfloors,
  getDeviceById,
  createOrUpdateFloor,
};
