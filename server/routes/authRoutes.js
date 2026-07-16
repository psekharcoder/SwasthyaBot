// Import Express Router
const express = require("express");

const router = express.Router();

// Import Authentication Controllers
const {

    signup,

    login,

    verifyOTP

} = require("../controllers/authController");

// Import JWT Authentication Middleware
const authMiddleware = require("../middleware/authMiddleware");


// ============================
// Signup Route
// ============================

// POST /api/auth/signup
// Registers a new user and sends an OTP to their email.
router.post("/signup", signup);


// ============================
// Login Route
// ============================

// POST /api/auth/login
// Allows only verified users to log in and receive a JWT token.
router.post("/login", login);


// ============================
// Verify OTP Route
// ============================

// POST /api/auth/verify-otp
// Verifies the OTP entered by the user and activates the account.
router.post("/verify-otp", verifyOTP);


// =======================================
// Protected Route
// Only accessible with a valid JWT Token
// =======================================

// GET /api/auth/profile
// Returns the logged-in user's information.
router.get("/profile", authMiddleware, (req, res) => {

    res.json({

        success: true,

        message: "Protected Route Accessed Successfully",

        user: req.user

    });

});


// Export Router
module.exports = router;