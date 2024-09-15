import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); //parse the json data in the req.body
app.use(express.urlencoded({ extended: true })); // to parse the form data in req.body
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// routes

import UserRoute from "./routes/user.router.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import imageRoute from "./routes/image.route.js";
app.use("/api/user", UserRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/image", imageRoute);

// create http server
const server = http.createServer(app);

// connect to mongo
connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`chat app server is running on port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`database connection failes`, err);
  });

// socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's origin
    methods: ["GET", "POST"], // Allowed methods
    allowedHeaders: ["Authorization"], // If you are using any headers like Authorization
    credentials: true, // Allow credentials if necessary
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Store the user when they join
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // Listen for sendMessage event (handles both text and image messages)
  socket.on("sendMessage", (message) => {
    const fullMessage = {
      ...message,
      name: users[socket.id],
      url: message.url || null,
      createdAt: message.createdAt || new Date().toISOString(),
    };

    // Emit the message to all clients including the sender
    io.emit("receiveMessage", fullMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left", users[socket.id]);
    delete users[socket.id];
  });
});
