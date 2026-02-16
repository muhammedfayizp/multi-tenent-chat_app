const express = require('express');
const createChatController = require('../../controllers/chatController/chatController');
const createChatService = require('../../service/chatService/chatService');
const authMiddleware = require('../../middleware/authMiddleware');


const chat_route = express.Router();

const chatService = createChatService();
const chatController = createChatController(chatService);


chat_route.get('/getMessages/:groupId',authMiddleware,chatController.getMessages)

module.exports = chat_route;
