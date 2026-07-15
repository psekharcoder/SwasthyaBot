// Import User model to interact with MongoDB users collection
const User = require("../models/User");

// Import bcrypt for hashing passwords
const bcrypt = require("bcryptjs");

// Import JWT to generate authentication tokens
const jwt = require("jsonwebtoken");

// Signup Controller
const signup = async (req, res) => {

    try {

        // Extract user data sent from frontend
        const { name, email, password } = req.body;

        // Check whether all required fields are provided
        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(409).json({

                success: false,

                message: "Email already registered."

            });

        }

        // ============================
        // Hash the password
        // ============================

        // bcrypt converts the original password into an encrypted hash.
        // The number 10 represents the salt rounds.
        // Higher rounds = stronger security but slower hashing.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const user = new User({

            name,

            email,

            // Store hashed password instead of plain text
            password: hashedPassword

        });

        // Save user into MongoDB
        await user.save();

        // Send success response
        res.status(201).json({

            success: true,

            message: "User registered successfully."

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

        // Extract email and password from request body
        const { email, password } = req.body;

        // Check whether both fields are provided
        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and Password are required."

            });

        }

        // Find user using email
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // Compare entered password with hashed password stored in MongoDB
        const isMatch = await bcrypt.compare(password, user.password);

        // If password is incorrect
        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password."

            });

        }

        // Generate JWT Token
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

        // Send success response
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

// Export Signup Controller
module.exports = {

    signup,
    login

};