const jwt = require('jsonwebtoken');
const User = require('../models/User');

//protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    let token;

    //check if token exists in headers
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists - return early if not
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route - No token provided',
        });
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //get user from token (without password)
        req.user = await User.findById(decoded.id).select('-password');

        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};