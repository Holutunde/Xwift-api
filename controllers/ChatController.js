const ChatModel = require("../models/chatModel");

exports.createChat = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (chat) {
      res.status(200).json("chat existing");
    } else {
      const newChat = new ChatModel({
        members: [senderId, receiverId],
      });
      const result = await newChat.save();
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.senderId, req.params.receiverId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
