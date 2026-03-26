const bcrypt = require("bcrypt");
const OrgRepo = require("../../repositories/orgRepository");
const UserRepo = require("../../repositories/userRepository");
const { genAccessToken, genRefreshToken, verifyToken } = require("../../utils/token");

const createAdminAuthService = () => {

    const adminLogin = async ({ name, email, password, orgName }) => {
        let admin = await UserRepo.findAdminByEmail(email);

        if (!admin) {
            if (!orgName) {
                return { success: false, message: "Organization name is required for new admin" };
            }

            const organization = await OrgRepo.createOrganization({ name: orgName });
            const passwordHash = await bcrypt.hash(password, 10);

            admin = await UserRepo.createUser({
                name,
                email,
                passwordHash,
                role: "admin",
                orgId: organization._id,
                status: "active",

            });

            console.log("New admin and organization created!");
        } else {
            const isMatch = await bcrypt.compare(password, admin.passwordHash);
            if (!isMatch) return { success: false, message: "Invalid credentials" };
        }

        const accessToken = genAccessToken(admin._id, admin.orgId, admin.role);
        const refreshToken = genRefreshToken(admin._id, admin.orgId, admin.role);

        return { success: true, message: "Admin logged successfully", accessToken, refreshToken, orgId: admin.orgId, role: admin.role };
    };

    const validateRefreshToken = async (token) => {
        const decoded = verifyToken(token); 
        const accessToken = genAccessToken(decoded.userId, decoded.orgId, decoded.role);
        const refreshToken = genRefreshToken(decoded.userId, decoded.orgId, decoded.role);
        return { accessToken, refreshToken, role: decoded.role };
    };

    return { adminLogin, validateRefreshToken };
};

module.exports = createAdminAuthService;
