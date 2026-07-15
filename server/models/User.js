// Import mongoose for creating MongoDB schemas
const mongoose = require("mongoose");

// Create User Schema
const userSchema = new mongoose.Schema(

    {

        // Full Name
        name: {

            type: String,

            required: true

        },

        // Email Address
        email: {

            type: String,

            required: true,

            unique: true

        },

        // Password (will be encrypted using bcrypt)
        password: {

            type: String,

            required: true

        },

        // User Role
        role: {

            type: String,

            default: "user"

        }

    },

    {

        // Automatically stores createdAt and updatedAt
        timestamps: true

    }

);

// Export User Model
module.exports = mongoose.model("User", userSchema);