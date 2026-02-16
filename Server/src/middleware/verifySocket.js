const jwt = require("jsonwebtoken");

const verifySocket = (socket, next) => {    
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);    
    socket.user = decoded;
    next();

  } catch (err) {
    next(new Error("Unauthorized"));
  }
};

module.exports = verifySocket;
