const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    getConversations,
    getConversation,
    deleteConversation,
    renameConversation

} = require("../controllers/conversationController");

router.get(

    "/",

    authMiddleware,

    getConversations

);

router.get(

    "/:id",

    authMiddleware,

    getConversation

);

router.delete(

    "/:id",

    authMiddleware,

    deleteConversation

);

router.put(

    "/:id",

    authMiddleware,

    renameConversation

);

module.exports = router;