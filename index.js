const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");

const devicesRouter = require("./routers/device_Router");
const floors_router = require("./routers/floor_Device_Routes");
const adminRouter = require("./routers/admin_Routes");

app.use(express.json());
app.use(cors());

app.use("/userImages", express.static(path.join(__dirname, "public", "userImages")));
app.use("/public", express.static("public"));


mongoose.connect(
  "mongodb+srv://phani9133:Phani%409133@phanicluster1.znlidni.mongodb.net/AdminDashboardDB"
)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", async (req, res) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections in DB:", collections.map((col) => col.name));
  res.send(
    `<h2>Collections in DB:</h2><ul>${collections
      .map((col) => `<li>${col.name}</li>`)
      .join("")}</ul>`
  );
});

// Routes
app.use("/device", devicesRouter);
app.use("/floor", floors_router);
app.use("/admin", adminRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
