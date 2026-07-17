// Import mongoose
const mongoose = require("mongoose");

// Create Chat Schema
const chatSchema = new mongoose.Schema(

    {

        // User who asked the question
        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // User's question
        question: {

            type: String,

            required: true

        },

        // AI's answer
        answer: {

            type: String,

            required: true

        }

    },

    {

        timestamps: true

    }

);

// Export Chat Model
module.exports = mongoose.model("Chat", chatSchema);