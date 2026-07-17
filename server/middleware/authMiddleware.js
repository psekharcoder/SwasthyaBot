// Import JWT library
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {

    try {

        // Get Authorization header
        const authHeader = req.header("Authorization");

        // Check if Authorization header exists
        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Access Denied. No Token Provided."

            });

        }

        // Extract token from "Bearer <token>"
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store decoded user
        req.user = decoded;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or Expired Token."

        });

    }

};

module.exports = authMiddleware;