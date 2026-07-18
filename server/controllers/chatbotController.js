// Import OpenAI SDK
const OpenAI = require("openai");

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

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({

                success: false,

                message: "Message is required."

            });

        }

        // ======================================
        // Fetch Previous Chats
        // ======================================

        const previousChats = await Chat.find({

            user: req.user.id

        })
            .sort({ createdAt: -1 })
            .limit(5);

        // Put them back into chronological order
        previousChats.reverse();

        // ======================================
        // Build Conversation History
        // ======================================

        const messages = [

            {

                role: "system",

                content: `
You are SwasthyaBot 🩺, an AI Healthcare Assistant.

Your job is ONLY to answer healthcare and medical-related questions.

You may answer questions about:
- Diseases
- Symptoms
- Medicines
- First Aid
- Nutrition
- Fitness
- Exercise
- Mental Health
- Pregnancy
- Child Health
- Vaccination
- Healthy Lifestyle
- Medical Tests
- General Wellness

If the user asks anything NOT related to healthcare such as:
- Mathematics
- Programming
- Coding
- Movies
- Songs
- Sports
- Cricket
- Politics
- History
- Geography
- News
- Weather
- General Knowledge
- Personal opinions

DO NOT answer.

Instead reply ONLY with:

"🩺 I'm SwasthyaBot and I can only assist with healthcare-related questions. Please ask me something about health, medicine, fitness, nutrition, or wellness."

Never break these rules.
Never answer non-health questions.
Always stay within healthcare.
`

            }

        ];

        // Add previous chats

        for (const chat of previousChats) {

            messages.push({

                role: "user",

                content: chat.question

            });

            messages.push({

                role: "assistant",

                content: chat.answer

            });

        }

        // Add current user message

        messages.push({

            role: "user",

            content: message

        });

        // ======================================
        // Send to Groq
        // ======================================

        const completion = await client.chat.completions.create({

            model: "llama-3.1-8b-instant",

            messages

        });

        // AI Reply

        const aiReply = completion.choices[0].message.content;

        // ======================================
        // Save Chat to MongoDB
        // ======================================

        await Chat.create({

            user: req.user.id,

            question: message,

            answer: aiReply

        });

        // ======================================
        // Return Response
        // ======================================

        res.status(200).json({

            success: true,

            reply: aiReply

        });

    }

    catch (error) {

        console.error(error);

        if (error.status === 429) {

            return res.status(429).json({

                success: false,

                message:
                    "Daily AI limit reached. Please try again later."

            });

        }

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

