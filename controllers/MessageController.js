const MessageModel = require("../models/messageModel.js");
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = new MessageModel({
      senderId,
      text,
      chatId,
    });

    const record = req.files?.audio;

    if (record) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        record.tempFilePath,
        {
          resource_type: "video",
          public_id: "audio_public_id",
          folder: "audio_folder",
        }
      );
      message.record = { secure_url, public_id };
    }
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.getAllMessages = async (req, res) => {
  try {
    const result = await MessageModel.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
