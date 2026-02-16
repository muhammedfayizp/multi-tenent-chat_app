const GroupModel = require("../models/GroupModel");

const createGroup = async (data, session = null) => {
    const [group] = await GroupModel.create([data], { session });
    return group;
};

const findGroupById = async (groupId, session = null) => {
    return GroupModel.findById(groupId).session(session);
};

const findGroupByName = async (name, orgId, session = null) => {
    return GroupModel.findOne({ name, orgId }).session(session);
};

const findGroupsByOrgId = async (orgId, session = null) => {
    return GroupModel.find({ orgId }).sort({ createdAt: -1 }).session(session);
};
const findGroupsByOrgIdandPopulate = async (orgId, session = null) => {
    return GroupModel.find({ orgId })
        .populate("members", "_id name email role")
        .sort({ createdAt: -1 })
        .session(session);
};

const addMemberToGroup = async (group, userId, session = null) => {
    if (!Array.isArray(group.members)) group.members = [];
    if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save({ session });
    }
    return group;
};

const removeMemberFromGroup = async (group, memberId, session = null) => {
    const initialLength = group.members.length;
    group.members = group.members.filter(m => m.toString() !== memberId.toString());
    if (group.members.length === initialLength) throw new Error("Member not found in group");
    await group.save({ session });
    return group;
};

const deleteGroupById = async (groupId, session = null) => {
    const query = GroupModel.findByIdAndDelete(groupId);
    if (session) query.session(session);
    return query;
};

const findGroupsByMember = async (memberId, session = null) => {
    return GroupModel.find({ members: memberId })
        .populate("members", "_id name email role")
        .sort({ createdAt: -1 })
        .session(session);
};


module.exports = {
    createGroup,
    findGroupById,
    findGroupByName,
    findGroupsByOrgId,
    findGroupsByOrgIdandPopulate,
    addMemberToGroup,
    removeMemberFromGroup,
    deleteGroupById,
    findGroupsByMember
};
