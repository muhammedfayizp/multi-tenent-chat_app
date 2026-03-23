const InviteModel = require('../models/InviteModel')


const createInvite = async (data, session = null) => {
    const { email, orgId, token } = data;

    const normalizedEmail = email.trim().toLowerCase();

    const query = InviteModel.findOne({
        email: normalizedEmail,
        orgId
    });
    
    if (session) query.session(session);
    
    let invite = await query;

    if (invite) {
        invite.token = token;
        invite.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await invite.save({ session });
        return invite;
    }

    const [newInvite] = await InviteModel.create([{
        email: normalizedEmail,
        orgId,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }], { session });

    return newInvite;
};

// Find invite by token
// const findInviteByToken = async (token, session = null) => {
//     return InviteModel.findOne({ token }).session(session);
// };

// // Delete invite
// const deleteInviteByToken = async (token, session = null) => {
//     return InviteModel.deleteOne({ token }).session(session);
// };

// Optional: find invite by email + org
// const findInviteByEmailAndOrg = async (email, orgId, session = null) => {
//     return InviteModel.findOne({
//         email: email.trim().toLowerCase(),
//         orgId
//     }).session(session);
// };

module.exports = {
    createInvite,
    // findInviteByToken,
    // deleteInviteByToken,
    // findInviteByEmailAndOrg
};