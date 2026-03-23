const messageRepo = require("../repositories/messageRepository");
const groupRepo = require("../repositories/groupRepository");

const connectedUsers = new Map(); 

module.exports = (io) => {
  io.on("connection", (socket) => {
    try {
      const { userId, orgId, role } = socket.user;

      connectedUsers.set(userId, {
        socketId: socket.id,
        orgId,
        role,
      });

      //JoinGroup 
      socket.on("joinGroup", async ({ groupId }) => {
        try {
          const group = await groupRepo.findGroupById(groupId);
          if (!group) return;

          const isMember = group.members.some((m) => m.toString() === userId);
          if (!isMember) return;

          socket.join(groupId);
        } catch (err) {
          console.error("joinGroup error:", err.message);
        }
      });

      // SendMsg
      socket.on("sendMessage", async ({ groupId, content }) => {
        try {
          if (!content?.trim()) return;

          const group = await groupRepo.findGroupById(groupId);
          if (!group) return;

          const isMember = group.members.some((m) => m.toString() === userId);
          if (!isMember) return;

          const newMessage = await messageRepo.createMessage({
            senderId: userId,
            groupId,
            content,
            readBy: [], 
          });

          // Emit to all group members
          io.to(groupId).emit("receiveMessage", newMessage);
        } catch (err) {
          console.error("sendMessage error:", err.message);
        }
      });

      // Message Read / Read Receipts 
      socket.on("messageRead", async ({ groupId, messageIds }) => {
        try {
          if (!groupId || !messageIds?.length) return;

          await messageRepo.markAsRead(messageIds, userId);

          io.to(groupId).emit("messageReadUpdate", {
            messageIds,
            userId, 
          });
        } catch (err) {
          console.error("messageRead error:", err.message);
        }
      });

      // Typing Indicator 
      socket.on("typing", ({ groupId }) => {
        socket.to(groupId).emit("userTyping", { userId });
      });

      // - Disconnect 
      socket.on("disconnect", () => {
        connectedUsers.delete(userId);
        console.log("User disconnected:", userId);
      });

    } catch (error) {
      console.error("Socket connection error:", error.message);
      socket.disconnect();
    }
  });
};


