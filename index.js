require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const connectDB = require("./database/db");
const ChatRoute = require("./routes/ChatRoute");
const MessageRoute = require("./routes/MessageRoute.js");
const fileUpload = require("express-fileupload");

const morgan = require("morgan");

const app = express();

const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

let activeUsers = [];

io.on("connection", (socket) => {
  console.log("sammy is oga");
  // add new User
  socket.on("add-chat", (getUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === getUserId)) {
      activeUsers.push({ userId: getUserId, socketId: socket.id });
    }
    console.log("New User Connected", activeUsers);
    // send all active users to new user
    io.emit("get-users-chat", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
      console.log("receiving:", data);
    } else {
      console.log("no user");
    }
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
