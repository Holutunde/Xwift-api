const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
    record: {
      type: Object,
      secure_url: {
        type: URL,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
