

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({success: false,message: "Access denied. No token provided",});
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({success: false,message: "Invalid authorization format",});
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error("JWT_ACCESS_SECRET not defined");
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({success: false,message: "Token expired or invalid",});
  }
};

module.exports = authMiddleware;
