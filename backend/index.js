const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");

const devicesRouter = require("./routers/device_Router");
const floors_router = require("./routers/floor_Device_Routes");
const adminRouter = require("./routers/admin_Routes");
const reportRouter = require("./routers/report_Routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  "/adminImage",
  express.static(path.join(__dirname, "public", "adminImage"))
);

// const Router = express.Router();
// app.use("/api", Router);

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://phani9133:Phani%409133@phanicluster1.znlidni.mongodb.net/AdminDashboardDB"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", async (req, res) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
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
app.use("/report", reportRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174", "http://localhost:5173"], // admin & incharge frontends
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

// 🔁 Optional: handle connected users
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  socket.on("register", (role) => {
    connectedUsers[role] = socket.id;
    console.log(` Registered: ${role} → ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(" Disconnected:", socket.id);
    for (let role in connectedUsers) {
      if (connectedUsers[role] === socket.id) {
        delete connectedUsers[role];
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const allowedOrigins = ["http://localhost:5174"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // only if using cookies
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );