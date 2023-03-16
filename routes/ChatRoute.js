const express = require("express");
const router = express.Router();
const {
  createChat,
  findChat,
  userChats,
} = require("../controllers/ChatController.js");

router.post("/:senderId/:receiverId", createChat);
router.get("/:userId", userChats);
router.get("/:senderId/:receiverId", findChat);

module.exports = router;
