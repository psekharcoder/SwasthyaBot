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

// =======================================
// Delete Conversation
// =======================================

const deleteConversation = async (req, res) => {

    try {

        const { id } = req.params;

        // Delete all chats inside this conversation
        await Chat.deleteMany({

            conversation: id,

            user: req.user.id

        });

        // Delete conversation
        await Conversation.findOneAndDelete({

            _id: id,

            user: req.user.id

        });

        res.status(200).json({

            success: true,

            message: "Conversation deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to delete conversation."

        });

    }

};

// =======================================
// Rename Conversation
// =======================================

const renameConversation = async (req, res) => {

     console.log("Rename route hit");

    try {

        const { id } = req.params;

        const { title } = req.body;

        if (!title || title.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Title is required."

            });

        }

        const conversation = await Conversation.findOneAndUpdate(

            {

                _id: id,

                user: req.user.id

            },

            {

                title: title.trim()

            },

            {

                new: true

            }

        );

        if (!conversation) {

            return res.status(404).json({

                success: false,

                message: "Conversation not found."

            });

        }

        res.status(200).json({

            success: true,

            conversation

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to rename conversation."

        });

    }

};

module.exports = {

    getConversations,
    getConversation,
    deleteConversation,
    renameConversation

};

