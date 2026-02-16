const express = require('express');
const createAdminAuthController = require('../../controllers/adminController/adminAuthController');
const createAdminAuthService = require('../../service/adminService/authService');


const adminAuth_route = express.Router();

const adminAuthService = createAdminAuthService();
const adminAuthController = createAdminAuthController(adminAuthService);




adminAuth_route.post('/login', adminAuthController.adminSignUp)
adminAuth_route.post('/refresh_token',adminAuthController.validateRefToken)

module.exports = adminAuth_route;
