const bcrypt = require("bcrypt");
const UserRepo = require("../../repositories/userRepository");
const inviteRepo = require('../../repositories/inviteRepository')
const { genAccessToken, genRefreshToken, verifyToken } = require("../../utils/token");


const createMemberAuthService = () => {

  const getInviteDetails = async (token) => {
    try {
      const invite = await inviteRepo.findByToken(token);
      console.log('in',invite);
      
  
      if (!invite) {
        throw new Error("Invalid or expired token");
      }
  
      // optional expiry check
      if (invite.expiresAt < new Date()) {
        throw new Error("Invite expired");
      }
  
      const user = await UserRepo.findUserByEmailAndOrg(
        invite.email,
        invite.orgId
      );
  console.log('uU',user);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return {
        name: user.name,
        email: user.email
      };
  
    } catch (error) {
      throw error;
    }
  };

  const memberLogin = async ({ email, password, name }) => {
    let member = await UserRepo.findMemberByEmail(email);

    if (!member) {
      const passwordHash = await bcrypt.hash(password, 10);
      member = await UserRepo.createMember({
        name,
        email,
        passwordHash,
        role: "member",
        orgId: null
      });
    } else {
      const isMatch = await bcrypt.compare(password, member.passwordHash);
      if (!isMatch) return { success: false, message: "Invalid credentials" };
    }

    const accessToken = genAccessToken(member._id, member.orgId, member.role);
    const refreshToken = genRefreshToken(member._id, member.orgId, member.role);

    return {
      success: true,
      message: "Member logged in successfully",
      accessToken,
      refreshToken,
      orgId: member.orgId,
      memberId: member._id,
      role: member.role
    };
  };

  const validateRefreshToken = async (token) => {
    const decoded = verifyToken(token);
    const accessToken = genAccessToken(decoded.userId, decoded.orgId, decoded.role);
    const refreshToken = genRefreshToken(decoded.userId, decoded.orgId, decoded.role);

    return { accessToken, refreshToken, role: decoded.role };
  };

  return { getInviteDetails,memberLogin, validateRefreshToken };
};

module.exports = createMemberAuthService;
