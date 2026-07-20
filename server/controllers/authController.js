// Import User model to interact with MongoDB users collection
const User = require("../models/User");

// Import bcrypt for hashing passwords
const bcrypt = require("bcryptjs");

// Import JWT to generate authentication tokens
const jwt = require("jsonwebtoken");

// Import Email Utility
const sendEmail = require("../utils/sendEmail");

// ==============================
// Signup Controller
// ==============================
const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        const user = new User({

            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false

        });

        await user.save();

        await sendEmail(

            email,

            "SwasthyaBot Email Verification",

            `Hello ${name},

Your OTP for SwasthyaBot is:

${otp}

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.`

        );

        res.status(201).json({

            success: true,
            message: "Signup Successful. Please verify your email using the OTP."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ==============================
// Login Controller
// ==============================
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Email and Password are required."

            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        if (!user.isVerified) {

            return res.status(401).json({

                success: false,
                message: "Please verify your email before logging in."

            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({

                success: false,
                message: "Invalid Password."

            });

        }

        const token = jwt.sign(

            {

                id: user._id,
                email: user.email,
                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.status(200).json({

            success: true,
            message: "Login Successful",
            token

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ==============================
// Verify OTP Controller
// ==============================
const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {

            return res.status(400).json({

                success: false,
                message: "Email and OTP are required."

            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        if (user.isVerified) {

            return res.status(400).json({

                success: false,
                message: "Email already verified."

            });

        }

        if (user.otp !== otp) {

            return res.status(400).json({

                success: false,
                message: "Invalid OTP."

            });

        }

        if (user.otpExpiry < new Date()) {

            return res.status(400).json({

                success: false,
                message: "OTP has expired."

            });

        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.status(200).json({

            success: true,
            message: "Email verified successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ==============================
// Get Profile Controller
// ==============================
const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password -otp -otpExpiry");

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        res.status(200).json({

            success: true,
            user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch profile."

        });

    }

};

module.exports = {

    signup,
    login,
    verifyOTP,
    getProfile

};