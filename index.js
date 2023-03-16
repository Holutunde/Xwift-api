require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const connectDB = require("./database/db");
const ChatRoute = require("./routes/ChatRoute");
const MessageRoute = require("./routes/MessageRoute.js");
const socket = require("./socket");

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(socket);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
