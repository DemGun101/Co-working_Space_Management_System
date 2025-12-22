import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import officeBoyRoutes from "./routes/office-boy";
import "./jobs/daily-reset";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://co-working-space-management11.web.app",
      "http://localhost:5174",
    ],
    credentials: true,
  },
});
// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://co-working-space-management11.web.app",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/office-boy", officeBoyRoutes);

// Start server
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
const officeBoyNamespace = io.of("/office-boy");
officeBoyNamespace.on("connection", (socket) => {
  console.log("Office boy connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Office boy disconnected:", socket.id);
  });
});

startServer();
