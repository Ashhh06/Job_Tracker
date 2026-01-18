const User = require('../models/User');
const jwt = require('jsonwebtoken');

//generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};


//register user
//POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        //validate input
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required details'
            });
        }

        //check if user already exists
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists!'
            });
        }

        //create user
        const user = await User.create({
            name, email, password
        });

        //generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};




//login user
//POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //validate input
        if (!email || !password) {
            return res.status(400).json({
              success: false,
              message: 'Please provide email and password',
            });
        }

        //check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
              success: false,
              message: 'Invalid credentials',
            });
        }

        //check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: 'Invalid credentials',
            });
        }

        //generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};



//get current logged in user
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
    
        res.status(200).json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        });
    } catch (error) {
        next(error);
    }
}