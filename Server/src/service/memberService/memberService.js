const OrgRepo = require("../../repositories/orgRepository");
const UserRepo = require("../../repositories/userRepository");
const GroupRepo = require("../../repositories/groupRepository");


const createMemberService = () => {
    const listGroupsForMember = async (memberUserId) => {
        try {
    
            const memberUser = await UserRepo.findUserById(memberUserId);
    
            console.log(memberUser,'mem');
            
            if (!memberUser || memberUser.role !== "member") {
                throw new Error("Member not found or unauthorized")


            }
    
            const orgId = memberUser.orgId
            if (!orgId) throw new Error("Member does not belong to any organization")
    


            const orgExists = await OrgRepo.findOrgById(orgId);
            if (!orgExists) console.log("Organization not found");
            
    
            const groups = await GroupRepo.findGroupsByMember(memberUserId)
    
            return { success: true, groups };
    
        } catch (error) {
            console.error("Member List Groups Error:", error);
            return { success: false, message: error?.message || "Failed to fetch groups" };
        }
    };

    return {listGroupsForMember}
    
}
module.exports = createMemberService;
