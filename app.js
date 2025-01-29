const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/config");

// Route imports
const authRoute = require("./routes/authRoute");
const bulkUploadRoute = require("./routes/bulkUpload");
const fileQueue = require("./queues/fileQueue");
const User = require("./models/user");
const Message = require("./models/Message");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/userRoute");

// Initialize Express App & HTTP Server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/bulkUpload", bulkUploadRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

const users = new Map(); // Store active users

io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.query.token;
    if (!token) {
      console.log("❌ No token provided.");
      socket.emit("error", "Unauthorized");
      socket.disconnect();
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        console.log("❌ JWT verification failed.");
        socket.emit("error", "Invalid token");
        socket.disconnect();
        return;
      }

      const userId = user.id;
      socket.join(userId); // Join the user in their own room
      users.set(userId, socket.id); // Track user as online
      console.log(`✅ User ${userId} connected.`);

      // Emit to all connected clients that this user is online
      io.emit("userStatus", { userId, status: "online" });

      // Handle private messages
      socket.on("privateMessage", async ({ receiverId, content }) => {
        if (!content.trim() || !receiverId) return;

        const newMessage = await Message.create({
          content,
          senderId: userId,
          receiverId,
        });

        // Emit the private message to both the sender and receiver
        io.to(receiverId).emit("privateMessage", newMessage);
        io.to(userId).emit("privateMessage", newMessage);
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        console.log(`🔴 User ${userId} disconnected.`);
        users.delete(userId); // Remove from the online users list

        // Emit to all connected clients that the user is offline
        io.emit("userStatus", { userId, status: "offline" });
      });
    });
  } catch (error) {
    console.error("❌ Socket.io connection error:", error);
    socket.emit("error", "Server error");
    socket.disconnect();
  }
});


// Default route
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Hello World",
  });
});

// Database Sync
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables synced!");
  })
  .catch((error) => {
    console.error("Error syncing database: ", error);
  });

// Start Server (Socket.io)
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
