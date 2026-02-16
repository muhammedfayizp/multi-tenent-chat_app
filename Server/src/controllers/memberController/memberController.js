const createMemberController = (memberService)=>{
    const getGroups = async(req,res)=>{
        try {
            
            const memberUserId = req.user?.userId;
            
            
      
            if (!memberUserId) {
              return res.status(401).json({ success: false, message: "Unauthorized" })
            }
      
            const response = await memberService.listGroupsForMember(memberUserId)
      
            return res.status(response.success ? 200 : 400)
            .json(response);
      
          } catch (error) {
            console.error("Get Groups Controller Error:", error);
      
            return res.status(500).json({ success: false, message: "Internal Server Error" });
          }
    }
    return {getGroups}
}

module.exports = createMemberController;
