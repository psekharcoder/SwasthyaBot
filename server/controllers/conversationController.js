const Conversation = require("../models/Conversation");
const Chat = require("../models/Chat");

// =======================================
// Get All Conversations
// =======================================

const getConversations = async (req, res) => {

    try {

        const conversations = await Conversation.find({

            user: req.user.id

        }).sort({

            updatedAt: -1

        });

        res.status(200).json({

            success: true,

            conversations

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch conversations."

        });

    }

};

// =======================================
// Get Single Conversation
// =======================================

const getConversation = async (req, res) => {

    try {

        const conversation = await Conversation.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!conversation) {

            return res.status(404).json({

                success: false,

                message: "Conversation not found."

            });

        }

        const chats = await Chat.find({

            conversation: conversation._id

        }).sort({

            createdAt: 1

        });

        res.status(200).json({

            success: true,

            conversation,

            chats

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch conversation."

        });

    }

};

module.exports = {

    getConversations,

    getConversation

};