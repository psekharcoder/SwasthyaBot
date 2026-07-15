// Imports the Express application
const app = require("./app");

// Imports the MongoDB connection function
const connectDB = require("./config/db");

// Loads environment variables from the .env file
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Reads the PORT from the .env file
const PORT = process.env.PORT || 5000;

// Starts the server
app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});