const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  socket.on("addNewUser", (newUser) => {
    if (!onlineUsers.some((user) => user._id === newUser._id)) {
      onlineUsers.push(newUser);
    }
    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
  socket.on("getOnlineUsers", () => {
    io.emit("getOnlineUsers", onlineUsers);
  });
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("send_message", (data) => {
    console.log("sent");

    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
