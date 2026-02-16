const MessageModel = require("../models/MessageModel");

const createMessage = async ({ senderId, groupId, content }, session = null) => {
    const [message] = await MessageModel.create([{ senderId, groupId, content }], { session });
    return message;
};

const findMessagesByGroup = async (groupId, session = null) => {
    return MessageModel.find({ groupId })
        .sort({ createdAt: 1 })
        .session(session);
};

const markAsRead = async (messageIds, userId) => {
    return Message.updateMany(
        { _id: { $in: messageIds }, "readBy.userId": { $ne: userId } },
        { $push: { readBy: { userId, readAt: new Date() } } }
    );
}


module.exports = {
    createMessage,
    findMessagesByGroup,
    markAsRead
};
