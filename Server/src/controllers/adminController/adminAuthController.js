const createAdminAuthController = (adminAuthService) => {

    const adminSignUp = async (req, res) => {
        try {
            const { name, email, password, orgName } = req.body;
            const response = await adminAuthService.adminLogin({ name, email, password, orgName });

            if (!response.success) return res.status(401).json(response);

            res.cookie(`refreshToken_${response.role}`, response.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 2 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                success: true,
                message: response.message,
                accessToken: response.accessToken,
                role: response.role,
                email,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
    };

    const validateRefToken = async (req, res) => {
        try {
            const cookieKey = Object.keys(req.cookies).find(key => key.startsWith("refreshToken_"));
            if (!cookieKey) return res.status(400).json({ success: false, message: "Refresh token not found" });

            const { accessToken, refreshToken, role } = await adminAuthService.validateRefreshToken(req.cookies[cookieKey]);

            // Update refresh token cookie
            res.cookie(cookieKey, refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 2 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ success: true, message: "Token refreshed", accessToken, role });
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: error.message });
        }
    };

    return { adminSignUp, validateRefToken };
};

module.exports = createAdminAuthController;
