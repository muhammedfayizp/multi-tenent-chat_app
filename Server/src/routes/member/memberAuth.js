
const express = require("express");
const createMemberAuthController = require("../../controllers/memberController/memberAuthController");
const createMemberAuthService = require("../../service/memberService/authService");

const memberAuthRoute = express.Router();

const memberAuthService = createMemberAuthService();
const memberAuthController = createMemberAuthController(memberAuthService);

memberAuthRoute.get('/invite-details/:token', memberAuthController.fetchInviteDetails)
memberAuthRoute.post('/handlePassword',memberAuthController.handlePassword)
memberAuthRoute.post("/login", memberAuthController.memberSignUp);
memberAuthRoute.post("/refresh_token", memberAuthController.validateRefToken);

module.exports = memberAuthRoute;
