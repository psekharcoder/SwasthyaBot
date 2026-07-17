// Import Express Router
const express = require("express");

const router = express.Router();

// Import Chatbot Controllers
const {

    chatWithAI,
    getChatHistory,
    deleteChat,
    clearChatHistory

} = require("../controllers/chatbotController");
// Import JWT Authentication Middleware
const authMiddleware = require("../middleware/authMiddleware");


// =======================================
// Chat Route
// =======================================

// POST /api/chat
// Only logged-in users can access the AI chatbot.
router.post("/", authMiddleware, chatWithAI);


// =======================================
// Chat History Route
// =======================================

// GET /api/chat/history
// Returns all previous chats of the logged-in user.
router.get("/history", authMiddleware, getChatHistory);
router.delete("/clear", authMiddleware, clearChatHistory);

// Delete one chat
router.delete("/:id", authMiddleware, deleteChat);


// Export Router
module.exports = router;