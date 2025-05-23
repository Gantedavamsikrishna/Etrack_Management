const express = require("express");
const mongoose = require("mongoose");
const app = express();
const devicesRouter = require("./routers/device_Router");
const cors = require("cors");
const floors_router = require("./routers/floor_Device_Routes");
const adminRouter = require("./routers/admin_Routes");
app.use(express.json());
app.use(cors());
const Router = express.Router();
app.use("/api", Router);

mongoose
  .connect(
    "mongodb+srv://phani9133:Phani%409133@phanicluster1.znlidni.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//testing the connection
Router.get("/", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections in DB:",
      collections.map((col) => col.name)
    );
    res.send(
      `<h2>Collections in DB:</h2><ul>${collections
        .map((col) => `<li>${col.name}</li>`)
        .join("")}</ul>`
    );
  } catch (err) {
    console.error("Error fetching collections:", err);
    res.status(500).send("Error fetching collections");
  }
});

app.use("/api", devicesRouter);
app.use("/floor", floors_router);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});
