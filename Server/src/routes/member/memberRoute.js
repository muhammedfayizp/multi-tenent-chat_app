const express = require('express');
const createMemberController = require('../../controllers/memberController/memberController');
const createMemberService = require('../../service/memberService/memberService');
const authMiddleware = require('../../middleware/authMiddleware');


const member_route = express.Router();

const memberService = createMemberService();
const memberController = createMemberController(memberService);



member_route.get('/getGroups',authMiddleware,memberController.getGroups)

module.exports = member_route;
