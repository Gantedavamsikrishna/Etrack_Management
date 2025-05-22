/*{
    "deviceName": "Device A",
    "price": 1200,
    "model": "Model X",
    "status": "active"
}

*/
const { CollegeData, Collegedata } = require("../model/usermodel");

const adduser = async (req, res) => {
  const {
    deviceId,
    deviceName,
    deviceModel,
    devicePrice,
    deviceStatus,
    count,
  } = req.body;
  try {
    const mydata = new Collegedata({
      deviceId,
      deviceName,
      deviceModel,
      devicePrice,
      deviceStatus,
      count,
    });
    await mydata.save();
    res.status(201).send({ message: "Device added successfully" });
  } catch (er) {
    console.error("Error adding device:", er);
    res
      .status(500)
      .send({ error: "Failed to add device.", details: er.message });
  }
};

const getuser = async (req, res) => {
  try {
    const {
      deviceId,
      deviceName,
      deviceModel,
      devicePrice,
      count,
      deviceStatus,
    } = req.query;
    const filter = {};

    if (deviceId) filter.deviceId = deviceId;
    if (deviceName) filter.deviceName = { $regex: deviceName, $options: "i" };
    if (deviceModel)
      filter.deviceModel = { $regex: deviceModel, $options: "i" };
    if (devicePrice) filter.devicePrice = Number(devicePrice);
    if (count) filter.count = Number(count);
    if (deviceStatus) filter.deviceStatus = deviceStatus;

    const data = await Collegedata.find(filter);
    res.status(200).json(data);
  } catch (er) {
    console.error("Error fetching devices:", er);
    res
      .status(500)
      .json({ message: "Failed to fetch devices", error: er.message });
  }
};

const addFloor = async (req, res) => {
  try {
    const { floors } = req.body;

    if (!floors || !Array.isArray(floors)) {
      return res
        .status(400)
        .send({ error: "Request body must contain a 'floors' array." });
    }

    for (const floor of floors) {
      if (!floor.floorName || typeof floor.floorName !== "string") {
        return res
          .status(400)
          .send({ error: "Each floor must have a valid floorName string." });
      }
      if (!floor.wings || !Array.isArray(floor.wings)) {
        return res
          .status(400)
          .send({ error: "Each floor must have a 'wings' array." });
      }
      for (const wing of floor.wings) {
        if (!wing.wingName || typeof wing.wingName !== "string") {
          return res
            .status(400)
            .send({ error: "Each wing must have a valid wingName string." });
        }
        if (!wing.rooms || !Array.isArray(wing.rooms)) {
          return res
            .status(400)
            .send({ error: "Each wing must have a 'rooms' array." });
        }
        for (const room of wing.rooms) {
          if (!room.roomName || typeof room.roomName !== "string") {
            return res
              .status(400)
              .send({ error: "Each room must have a valid roomName string." });
          }
          if (!room.devices || !Array.isArray(room.devices)) {
            return res
              .status(400)
              .send({ error: "Each room must have a 'devices' array." });
          }
          for (const device of room.devices) {
            if (!device.devicePrice || typeof device.devicePrice !== "number") {
              return res.status(400).send({
                error: "Each device must have a valid numeric devicePrice.",
              });
            }
          }
        }
      }
    }

    const newFloors = await CollegeData.insertMany(floors);
    res.status(201).send({
      message: "Floors added successfully",
      data: newFloors,
    });
  } catch (error) {
    console.error("Error adding floors:", error);
    res
      .status(500)
      .send({ error: "Failed to add floors", details: error.message });
  }
};

const getFloors = async (req, res) => {
  try {
    const { floorName, wingName, roomName, deviceName, deviceStatus } =
      req.query;

    let floorFilter = {};
    if (floorName) floorFilter.floorName = { $regex: floorName, $options: "i" };

    const floors = await CollegeData.find(floorFilter).lean();

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
  adduser,
  getuser,
  addFloor,
  getFloors,
};
