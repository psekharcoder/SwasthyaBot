// Imports mongoose library to communicate with MongoDB
const mongoose = require("mongoose");

// Function to establish a connection with MongoDB Atlas
const connectDB = async () => {

    try {

        // Connect to MongoDB using the URI stored in the .env file
        await mongoose.connect(process.env.MONGODB_URI);

        // If the connection is successful, display this message
        console.log("✅ MongoDB Connected Successfully");

    } catch (error) {

        // If an error occurs, display the error message
        console.error("❌ MongoDB Connection Failed");

        console.error(error.message);

        // Exit the application because the database is essential
        process.exit(1);
    }

};

// Export this function so it can be used in server.js
module.exports = connectDB;