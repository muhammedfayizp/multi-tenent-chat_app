const jwt = require('jsonwebtoken');

const genAccessToken = (userId, orgId, role) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('Access Token secret missing');
    return jwt.sign({ userId, orgId, role }, secret, { expiresIn: '1h' });
};

const genRefreshToken = (userId, orgId, role) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error('Refresh Token secret missing');
    return jwt.sign({ userId, orgId, role }, secret, { expiresIn: '2d' });
};

const verifyToken = (token, type = 'refresh') => {
    if (!token) {
        const error = new Error('Token missing');
        error.status = 401;
        throw error;
    }
    const secret = type === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;

    try {
        return jwt.verify(token, secret);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            const error = new Error('Token_expired');
            error.status = 401;
            throw error;
        }
        throw new Error('Invalid token');
    }
};

module.exports = { genAccessToken, genRefreshToken, verifyToken };

