const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Handle socket events
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // Drawing events
  socket.on("draw", (point) => {
    socket.broadcast.emit("draw", point);
  });

  // Undo/Redo
  socket.on("undo", (stack) => {
    socket.broadcast.emit("undo", stack);
  });
  socket.on("redo", (stack) => {
    socket.broadcast.emit("redo", stack);
  });

  // Clear
  socket.on("clearCanvas", () => {
    io.emit("clearCanvas");
  });

  // Sticky notes
  // Sticky notes
socket.on("sticky:create", (data) => {
  io.emit("sticky:create", data);  // ✅ send to all, including creator
});

socket.on("sticky:move", (data) => {
  socket.broadcast.emit("sticky:move", data);
});

socket.on("sticky:update", (data) => {
  socket.broadcast.emit("sticky:update", data);
});

socket.on("sticky:delete", (id) => {
  io.emit("sticky:delete", id);
});

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
