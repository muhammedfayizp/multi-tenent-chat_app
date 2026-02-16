const createAdminController = (adminService) => {
 
 const createGroup = async (req, res) => {
    try {
      const adminUserId = req.user?.userId
      if (!adminUserId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const response = await adminService.groupCreation(req.body, adminUserId);
      return res.status(response.success ? 201 : 400).json(response);

    } catch (error) {
      console.error("Controller Error:", error.message);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  const getGroups = async (req, res) => {
    try {
      const adminUserId = req.user?.userId;

      if (!adminUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const response = await adminService.listGroups(adminUserId);

      return res.status(response.success ? 200 : 400).json(response);

    } catch (error) {
      console.error("Get Groups Controller Error:", error);

      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  const addMembers = async (req, res) => {
    try {
      const { groupId, userName, email, role } = req.body;

      if (!groupId || !email) {
        return res.status(400).json({ success: false, message: "Group ID and email are required" });
      }

      const response = await adminService.createMember(groupId, userName, email, role);

      const status = response.status || (response.success ? 200 : 400);

      return res.status(status).json(response);

    } catch (error) {
      console.error("Error in addMembers:", error);
      return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };

  const getMembers = async (req, res) => {    
    try {
      const { groupId } = req.params      

      if (!groupId) {
        return res.status(400).json({ success: false, message: "Group ID is required" });
      }

      const response = await adminService.fetchMembers(groupId);

      return res.status(response.status || 200).json(response);
    } catch (error) {
      console.error("Error in getMembers:", error);
      return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };


  const removeMember = async (req, res) => {
    try {
      const { groupId, memberId } = req.body




      if (!groupId || !memberId) {
        return res.status(400).json({ success: false, message: "GroupId and MemberId required" });
      }

      const response = await adminService.removeMemberFromGrp(groupId, memberId)


      return res.status(response.status || 200).json(response);
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  const DeleteOrLeave = async (req, res) => {
    try {
  
      const { groupId } = req.body;
      const userId = req.userId;
      console.log(groupId,userId);
      
  
      const response = await adminService.DelOrLea(groupId, userId);
  console.log(response,'in conr');
  
      return res.status(response.status || 200).json(response);
  
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  };
  

  return { createGroup, getGroups, addMembers, getMembers, removeMember, DeleteOrLeave };
};

module.exports = createAdminController;
