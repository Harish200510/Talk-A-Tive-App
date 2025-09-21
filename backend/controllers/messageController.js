const expressAsyncHandler = require("express-async-handler");
const Message = require("./../Models/messageModel");
const User = require("./../Models/userModel");
const Chat = require("./../Models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  //---What are all we need---
  //1)Chat id - on which chat we are gonna send the message
  //2)Acctual Message Itself
  //3)Who is the sender of the message

  const { content, chatId } = req.body;

  //if the content or chatId is missing or not there
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400);
  }

  //creating a new message
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    //replacing whatever the new message comes as a latest message
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//getting all the chat for the particluar chat
const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
