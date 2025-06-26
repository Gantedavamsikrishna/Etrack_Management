import { io } from "socket.io-client";

const socket = io("https://etrack-backend.onrender.com", {
  withCredentials: true,
});

export default socket;
