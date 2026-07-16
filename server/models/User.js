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

        // Password (Stored in encrypted form using bcrypt)
        password: {

            type: String,

            required: true

        },

        // User Role
        role: {

            type: String,

            default: "user"

        },

        // Indicates whether the user's email has been verified
        isVerified: {

            type: Boolean,

            default: false

        },

        // Stores the latest OTP sent to the user
        otp: {

            type: String,

            default: null

        },

        // Stores the OTP expiry time
        otpExpiry: {

            type: Date,

            default: null

        }

    },

    {

        // Automatically creates createdAt and updatedAt fields
        timestamps: true

    }

);

// Export User Model
module.exports = mongoose.model("User", userSchema);