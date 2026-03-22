import "dotenv/config";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { setIo } from "./config/socket.js";
import { User } from "./models/User.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDb();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  setIo(io);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("name role");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);
    socket.join(`role:${socket.user.role}`);
    socket.on("chat:join", (roomId) => socket.join(roomId));
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
