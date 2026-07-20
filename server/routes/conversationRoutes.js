const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    getConversations,

    getConversation

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

module.exports = router;