const jwt = require('jsonwebtoken');

let blacklistedTokens = []; // Danh sách token bị blacklist, có thể lưu vào Redis hoặc database để quản lý

module.exports = function(req, res, next) {
    // Lấy token từ header
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const extractedToken = token.split(' ')[1];

    // Kiểm tra token có trong danh sách blacklist không
    if (blacklistedTokens.includes(extractedToken)) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Phương thức để thêm token vào blacklist
module.exports.addTokenToBlacklist = function(token) {
    blacklistedTokens.push(token);
};
