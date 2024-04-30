import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// Initialize express app
const app = express();

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Create a new HTTP server and wrap it with Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Get port from environment variables or use 3000 as default
const PORT = process.env.PORT || 3000;

// Get mode from environment variables or use "PRODUCTION" as default
export const mode = process.env.NODE_ENV.trim() || "PRODUCTION";

// Get JWT secret key from environment variables
const secretKey = process.env.JWT_SECRET;

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Define a route handler for GET requests to the root path
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Define a route handler for GET requests to /login
app.get("/login", (req, res) => {
  // Create a JWT and send it as a cookie
  const token = jwt.sign({ _id: "1234" }, secretKey);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .json({ message: "Logged in successfully!" });
});

// Use a middleware to authenticate the socket connection
io.use((socket, next) => {
  // Parse the cookies from the request headers
  cookieParser()(socket.request, {}, (err) => {
    if (err) return next(err);
    // Get the token from the cookies
    const token = socket.request.cookies.token;
    // If there's no token, return an error
    if (!token) return next(new Error("Authentication error!"));
    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return next(new Error("Authentication error!"));
      // If the token is valid, store the decoded data in the socket object
      socket.decoded = decoded;
      next();
    });
  });
});

// Define what happens when a client connects
io.on("connection", (socket) => {
  console.log(`Socket with ID '${socket.id}' connected!`);

  // Define what happens when a "message" event is received
  socket.on("message", ({ room, message, socketId }) => {
    console.log({ room, message, socketId });
    // Emit the message to all clients in the room
    socket.to(room).emit("recieve-message", { message, sid: socketId });
  });

  // Define what happens when a "join-room" event is received
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`Socket with ID '${socket.id}' joined room '${room}'!`);
  });

  // Define what happens when a client disconnects
  socket.on("disconnect", () => {
    console.log(`Socket with ID '${socket.id}' disconnected!`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${mode} mode.`);
});
