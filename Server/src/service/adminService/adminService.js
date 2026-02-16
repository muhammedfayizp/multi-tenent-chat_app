const orgRepo = require("../../repositories/orgRepository");
const userRepo = require("../../repositories/userRepository");
const groupRepo = require("../../repositories/groupRepository");
const bcrypt = require("bcryptjs");


const createAdminService = () => {

    const groupCreation = async (groupForm, adminUserId, session = null) => {
        try {

            if (!groupForm || !groupForm.name) {
                throw new Error("Group name is required");
            }

            const { name, users = [] } = groupForm;


            const adminUser = await userRepo.findUserById(adminUserId, session);

            if (!adminUser || adminUser.role !== "admin") {
                throw new Error("Admin not found or unauthorized");
            }

            const orgId = adminUser.orgId;

            if (!orgId) {
                throw new Error("Admin does not belong to any organization");
            }

            const orgExists = await orgRepo.findOrgById(orgId, session);

            if (!orgExists) {
                throw new Error("Organization not found");
            }

            const existingGroup = await groupRepo.findGroupByName(name.trim(), orgId, session);

            if (existingGroup) {
                throw new Error("Group with this name already exists");
            }

            // Create -- group    
            const newGroup = await groupRepo.createGroup(
                {
                    name: name.trim(),
                    orgId,
                    createdBy: adminUserId
                },
                session
            );

            await userRepo.addGroupToUser(adminUser, newGroup._id, session);
            newGroup.members.push(adminUser._id);

            const validUsers = users.filter(u => u?.name && u.name.trim() !== "" && u?.email && u.email.trim() !== "");



            for (const u of validUsers) {
                const name = u.name.trim();
                const email = u.email.trim().toLowerCase();

                let user = await userRepo.findUserByEmailAndOrg(email, orgId, session);

                const defaultPassword = "defaultPassword123";
                const passwordHash = await bcrypt.hash(defaultPassword, 10);

                if (!user) {
                    user = await userRepo.createMember({
                        name,
                        email,
                        role: u.role || "member",
                        orgId,
                        groupIds: [newGroup._id],
                        passwordHash
                    }, session);
                } else {
                    await userRepo.addGroupToUser(user, newGroup._id, session);
                }

                newGroup.members.push(user._id);
            }

            await newGroup.save();


            return {
                success: true,
                message: "Group created successfully",
                group: newGroup
            };

        } catch (error) {

            console.error("Error creating group:", error);

            return {
                success: false,
                message: error?.message || "Failed to create group"
            };
        }
    };


    const listGroups = async (adminUserId) => {
        try {
            const adminUser = await userRepo.findUserById(adminUserId);

            if (!adminUser || adminUser.role !== "admin") {
                throw new Error("Admin not found or unauthorized");
            }

            const orgId = adminUser.orgId;
            if (!orgId) throw new Error("Admin does not belong to any organization");

            const orgExists = await orgRepo.findOrgById(orgId);
            if (!orgExists) throw new Error("Organization not found");

            const groups = await groupRepo.findGroupsByOrgId(orgId);

            const populatedGroups = await groupRepo.findGroupsByOrgIdandPopulate(orgId);
        
            return { success: true, groups: populatedGroups };

        } catch (error) {
            console.error("List Groups Error:", error);
            return { success: false, message: error?.message || "Failed to fetch groups" };
        }
    };

    const createMember = async (groupId, userName, email, role = "member", session = null) => {
        try {
            const group = await groupRepo.findGroupById(groupId, session);
            if (!group) return { success: false, status: 404, message: "Group not found" };

            const orgId = group.orgId; 

            let user = await userRepo.findUserByEmail(email, session);

            if (!user) {
                const hashedPassword = await bcrypt.hash("defaultPassword123", 10);
                user = await userRepo.createUser({
                    email,
                    name: userName,
                    passwordHash: hashedPassword,
                    orgId,
                    role,
                }, session);
            }

           
            await groupRepo.addMemberToGroup(group, user._id, session);
            await userRepo.addGroupToUser(user, group._id, session);

            return { success: true, message: "User added to group successfully", group };
        } catch (error) {
            console.error("Error in createMember:", error);
            return { success: false, status: 500, message: "Server error", error: error.message };
        }
    };

    const fetchMembers = async (groupId, session = null) => {
        try {
            const group = await groupRepo.findGroupById(groupId, session);

            if (!group) {
                return { success: false, status: 404, message: "Group not found" };
            }

            const members = await userRepo.findUsersByIds(group.members, session);
            const groupWithOrg = await groupRepo.findGroupById(groupId, session);
            await groupWithOrg.populate("orgId", "name");
            const orgName = groupWithOrg?.orgId?.name || "Unknown Org";

            return { success: true, members, orgName };
        } catch (error) {
            console.error("Error in getGroupMembers:", error);
            return { success: false, status: 500, message: "Server error", error: error.message };
        }
    }

    const removeMemberFromGrp = async (groupId, memberId) => {
        try {


            const group = await groupRepo.findGroupById(groupId);


            if (!groupId || !memberId) {
                return { success: false, status: 404, message: "GroupId or MemberId not found" };

            }
            const updatedGroup = await groupRepo.removeMemberFromGroup(
                group,
                memberId
            );



            return { success: true, status: 200, message: "Member removed successfully", group: updatedGroup };

        } catch (error) {
            return { success: false, status: 500, message: "Server error", error: error.message };
        }
    };


const DelOrLea = async (groupId, userId) => {
    try {


        const group = await groupRepo.findGroupById(groupId);

        if (!group) {
            return {success: false,status: 404,message: "Group not found"};
        }

        const isAdmin = group.createdBy.toString() === userId.toString();

        if (isAdmin) {

            await userRepo.removeGroupFromUsers(groupId);
            await groupRepo.deleteGroupById(groupId);

            return {
                success: true,
                message: "Community deleted successfully"
            };
        }

        await groupRepo.removeMemberFromGroup(group, userId);
        await userRepo.removeGroupFromSingleUser(userId, groupId);

        return {success: true,message: "You left the community"};

    } catch (error) {

        return {success: false,status: 500,message: "Server error",error: error.message};
    }
};


    return { groupCreation, listGroups, createMember, fetchMembers, removeMemberFromGrp, DelOrLea };
};

module.exports = createAdminService;
