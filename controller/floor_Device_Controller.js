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
module.exports = {
  createFloor,
  getAllFloors,
  filterByfloors,
};
