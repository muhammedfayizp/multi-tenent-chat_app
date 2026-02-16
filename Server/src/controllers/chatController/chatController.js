const createChatController = (chatService) => {
    const getMessages = async (req, res) => {
        try {
            const { groupId } = req.params;
            const userId = req.user.userId;
            console.log(groupId,userId,'ug inco');
            

            const messages = await chatService.fetchMessages(groupId, userId);
            console.log(messages,'sdfsfsf');
            

            res.status(200).json({success: true,messages,});

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    return { getMessages };
};

module.exports = createChatController;
