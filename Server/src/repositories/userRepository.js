

const UserModel = require("../models/UserModel");
const User = require("../models/UserModel");


const findAdminByEmail = async (email, session = null) => {
    return User.findOne({ email, role: "admin" }).session(session)

}


const findMemberByEmail = async (email, session = null) => {

    return User.findOne({ email, role: "member" })
        .session(session);
};


const findUserById = async (userId, session = null) => {
    return User.findById(userId).session(session);
};


const findUserByEmailAndOrg = async (email, orgId, session = null) => {
    return User.findOne({ email, orgId }).session(session);
};


// const createUser = async (userData, session = null) => {
//     const [user] = await User.create([userData], { session });
//     return user;
// };


const createMember = async (userData, session = null) => {

    const [user] = await User.create([userData], { session });
    return user;

};
const addGroupToUser = async (user, groupId, session = null) => {

    if (!user.groupIds.includes(groupId)) {
        user.groupIds.push(groupId);
        return user.save({ session });
    }
    return user;

};


const findUserByEmail = async (email, session = null) => {
    return User.findOne({ email }).session(session);
};


const findUsersByIds = async (userIds, session = null) => {
    if (!userIds || userIds.length === 0) return []

    return await User.find({ _id: { $in: userIds }, status: 'active' })
        .select("_id name email role")
        .session(session)
};


const removeGroupFromUsers = async (groupId, session = null) => {

    const query = UserModel.updateMany(
        { groups: groupId },
        { $pull: { groups: groupId } }
    );


    if (session) query.session(session)

    return query;
};
const removeGroupFromSingleUser = async (userId, groupId, session = null) => {

    const query = UserModel.findByIdAndUpdate(
        userId,
        { $pull: { groups: groupId } },
        { new: true }
    );


    if (session) query.session(session);

    return query;
};

module.exports = {
    findAdminByEmail,
    findMemberByEmail,
    findUserById,
    findUserByEmailAndOrg,
    createUser,
    createMember,
    addGroupToUser,
    findUserByEmail,
    findUsersByIds,
    removeGroupFromUsers,
    removeGroupFromSingleUser
};
