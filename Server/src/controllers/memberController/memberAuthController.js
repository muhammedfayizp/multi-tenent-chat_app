

const createMemberAuthController = (memberAuthService) => {

  const fetchInviteDetails = async (req, res) => {
    try {
      const { token } = req.params;
  
      const response = await memberAuthService.getInviteDetails(token);
  
      res.status(200).json({
        success: true,
        response
      });
  
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Error fetching invite details"
      });
    }
  };
  const memberSignUp = async (req, res) => {
    try {
      const memberData = req.body;
      const response = await memberAuthService.memberLogin(memberData);

      if (!response.success) return res.status(401).json(response);

      // Store refresh token in httpOnly cookie
      res.cookie(`refreshToken_${response.role}`, response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: response.message,
        accessToken: response.accessToken,
        name: response.name,
        role: response.role,
        email: memberData.email,
        orgId: response.orgId,
        memberId: response.memberId
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const validateRefToken = async (req, res) => {
    try {
      const cookieKey = Object.keys(req.cookies).find(key => key.startsWith("refreshToken_member"));
      if (!cookieKey) return res.status(400).json({ success: false, message: "Refresh token not found" });

      const { accessToken, refreshToken, role } = await memberAuthService.validateRefreshToken(req.cookies[cookieKey]);

      // Update refresh token cookie
      res.cookie(cookieKey, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({ success: true, message: "Token refreshed", accessToken, role });

    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: error.message });
    }
  };

  return { fetchInviteDetails, memberSignUp, validateRefToken };
};

module.exports = createMemberAuthController;
