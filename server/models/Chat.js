const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
{
    conversation:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    message:String,

    response:String
},
{
    timestamps:true
}
);

module.exports = mongoose.model("Chat",chatSchema);