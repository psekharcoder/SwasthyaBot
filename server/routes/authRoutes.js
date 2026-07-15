// Import Express Router
const express = require("express");

const router = express.Router();

// Import Authentication Controllers
const {

    signup,

    login

} = require("../controllers/authController");

// Import JWT Authentication Middleware
const authMiddleware = require("../middleware/authMiddleware");

// ============================
// Signup Route
// ============================

// POST /api/auth/signup
router.post("/signup", signup);


// ============================
// Login Route
// ============================

// POST /api/auth/login
router.post("/login", login);

// ============================
// Login Route
// ============================

router.post("/login", login);

// =======================================
// Protected Route
// Only accessible with a valid JWT Token
// =======================================

router.get("/profile", authMiddleware, (req, res) => {

    res.json({

        success: true,

        message: "Protected Route Accessed Successfully",

        user: req.user

    });

});

// Export Router
module.exports = router;


// Export Router
module.exports = router;