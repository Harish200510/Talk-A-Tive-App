const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");


dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(`Server Started on PORT ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000, //if the user not sending any message it will close the connection to save the bandwith (before closing it will wait for 60000 milli second)
  cors: {
    //it should be frontend running port
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  //Everytime person opens the app the own personal socket will be created
  //creating a separate room to chat
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  //when a new user comes in added to this particular room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined Room:" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
