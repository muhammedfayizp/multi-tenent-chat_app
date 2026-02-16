const express = require("express");
const createAdminService = require("../../service/adminService/adminService");
const createAdminController = require("../../controllers/adminController/adminController");

const admin_route = express.Router();
const adminService = createAdminService();
const adminController = createAdminController(adminService);

const authMiddleware = require("../../middleware/authMiddleware");


admin_route.post("/createGroup", authMiddleware, adminController.createGroup);
admin_route.get('/getGroups',authMiddleware,adminController.getGroups)
admin_route.post('/addMemberToGroup', authMiddleware,adminController.addMembers)
admin_route.get('/getMembers/:groupId', authMiddleware, adminController.getMembers)
admin_route.post('/removeMemnerFrGrp', authMiddleware,adminController.removeMember)
admin_route.post('/leaveOrDeleteGroup', authMiddleware,adminController.DeleteOrLeave)


module.exports = admin_route;
