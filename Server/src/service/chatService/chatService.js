const groupRepo = require("../../repositories/groupRepository");
const messageRepo = require("../../repositories/messageRepository");


const createChatService = () => {
    const fetchMessages = async (groupId, userId) => {

        const group = await groupRepo.findGroupById(groupId);
        console.log(group,'gp');
        
    
        if (!group) {
            throw new Error("Group not found");
        }
    
        const isMember = group.members.some(
            member => member.toString() === userId.toString()
        );
        
    
        if (!isMember) {
            throw new Error("Unauthorized");
        }
    
        const messages = await messageRepo.findMessagesByGroup(groupId);
        console.log('msg',messages);
        
    
        return messages;
    };
    return {fetchMessages}
}
module.exports = createChatService;