const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({

    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },
    readBy: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          readAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
