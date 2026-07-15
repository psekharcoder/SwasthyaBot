// Imports the Express framework to create the backend server
const express = require("express");

// Allows the frontend (Angular) and backend (Express) to communicate
// even if they run on different ports (e.g., Angular:4200, Express:5000)
const cors = require("cors");

// Loads environment variables from the .env file
// Example: PORT, MongoDB URI, JWT Secret, Email Password
require("dotenv").config();

// Creates an Express application
const app = express();


// =====================
// Middleware
// =====================

// Enables Cross-Origin Resource Sharing (CORS)
// Without this, Angular cannot send requests to the backend
app.use(cors());

// Converts incoming JSON request bodies into JavaScript objects
// Example:
// {
//    "email": "abc@gmail.com",
//    "password": "123456"
// }
// becomes accessible as:
// req.body.email
// req.body.password
app.use(express.json());


// =====================
// Test Routes
// =====================

// Root route
// Opens when someone visits:
// http://localhost:5000/
app.get("/", (req, res) => {

    // Sends plain text to the browser
    res.send("Welcome to SwasthyaBot Backend");

});


// Health Check API
// Opens when someone visits:
// http://localhost:5000/api/health
// Used to verify that the backend is running properly
app.get("/api/health", (req, res) => {

    // Sends a JSON response
    res.json({

        success: true,

        message: "Backend is running successfully"

    });

});


// Exports the app so server.js can use it
module.exports = app;