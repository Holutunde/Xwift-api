const express = require("express");
const router = express.Router();
const {
  addMessage,
  getMessages,
  getAllMessages,
} = require("../controllers/MessageController.js");

router.post("/", addMessage);

router.get("/", getAllMessages);

router.get("/:chatId", getMessages);

module.exports = router;
