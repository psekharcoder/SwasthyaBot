// Import OpenAI SDK
const OpenAI = require("openai");

const Conversation = require("../models/Conversation");

// Import Chat Model
const Chat = require("../models/Chat");

// Create Groq Client
const client = new OpenAI({

    apiKey: process.env.GROQ_API_KEY,

    baseURL: "https://api.groq.com/openai/v1"

});

// ======================================
// Chat Controller
// ======================================
const chatWithAI = async (req, res) => {

    try {

        const { message, conversationId } = req.body;

        if (!message) {

            return res.status(400).json({

                success: false,

                message: "Message is required."

            });

        }

        // ======================================
        // Find/Create Conversation
        // ======================================

        let conversation;

        if (conversationId) {

            conversation = await Conversation.findOne({

                _id: conversationId,

                user: req.user.id

            });

        }

        if (!conversation) {

            conversation = await Conversation.create({

                user: req.user.id,

                title:
                    message.length > 30
                        ? message.substring(0, 30) + "..."
                        : message

            });

        }

        // ======================================
        // Previous Messages
        // ======================================

        const previousChats = await Chat.find({

            conversation: conversation._id

        }).sort({

            createdAt: 1

        });

        // ======================================
        // AI Messages
        // ======================================

        const messages = [

            {

                role: "system",

                content: `
You are SwasthyaBot 🩺, an AI Healthcare Assistant.

You ONLY answer healthcare and medical related questions.

If the question is not healthcare related, reply ONLY:

"🩺 I'm SwasthyaBot and I can only assist with healthcare-related questions. Please ask me something about health, medicine, fitness, nutrition, or wellness."

Never answer non-health questions.
`

            }

        ];

        // Previous Conversation

        previousChats.forEach(chat => {

            messages.push({

                role: "user",

                content: chat.message

            });

            messages.push({

                role: "assistant",

                content: chat.response

            });

        });

        // Current Message

        messages.push({

            role: "user",

            content: message

        });

        // ======================================
        // Ask Groq
        // ======================================

        const completion = await client.chat.completions.create({

            model: "llama-3.1-8b-instant",

            messages

        });

        const aiReply = completion.choices[0].message.content;

        // ======================================
        // Save Chat
        // ======================================

        await Chat.create({

            conversation: conversation._id,

            user: req.user.id,

            message,

            response: aiReply

        });

        // ======================================
        // Return
        // ======================================

        res.status(200).json({

            success: true,

            reply: aiReply,

            conversationId: conversation._id

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to generate AI response."

        });

    }

};
// ======================================
// Get Chat History
// ======================================

const getChatHistory = async (req, res) => {

    try {

        const chats = await Chat.find({

            user: req.user.id

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            history: chats

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch chat history."

        });

    }

};

// ======================================
// Delete Single Chat
// ======================================

const deleteChat = async (req, res) => {

    try {

        const { id } = req.params;

        const chat = await Chat.findOneAndDelete({

            _id: id,

            user: req.user.id

        });

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Chat not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Chat deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to delete chat."

        });

    }

};

// ======================================
// Clear All Chats
// ======================================

const clearChatHistory = async (req, res) => {

    try {

        await Chat.deleteMany({

            user: req.user.id

        });

        res.status(200).json({

            success: true,

            message: "All chats deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to clear chat history."

        });

    }

};


module.exports = {

    chatWithAI,
    getChatHistory,
    deleteChat,
    clearChatHistory
};

