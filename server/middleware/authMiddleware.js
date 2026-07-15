// Import JWT library
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {

    try {

        // Read JWT token from the Authorization header
        // Example Header:
        // Authorization: eyJhbGc...
        const token = req.header("Authorization");

        // Check whether the token exists
        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Access Denied. No Token Provided."

            });

        }

        // Verify the token using the secret key stored in .env
        // If the token is fake or expired, this line throws an error.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store the decoded user information inside the request object.
        // This allows future controllers to know who the logged-in user is.
        req.user = decoded;

        // Move to the next middleware or controller
        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or Expired Token."

        });

    }

};

// Export middleware
module.exports = authMiddleware;