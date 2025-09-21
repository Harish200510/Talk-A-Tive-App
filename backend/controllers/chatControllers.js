const expressAsyncHandler = require("express-async-handler");
const Chat = require("./../Models/chatModel");
const { models } = require("mongoose");
const User = require("./../Models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
  //we will get the user ID to whom we want to create a chat
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  //If there is a chat already exist return it if not create a new chat and return it

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "lastestMessage.sender",
    select: "name pic email",
  });

  //if chat exist then return chat
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //or else create a new chat and send
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      //putting a newly created chat in database
      const createdChat = await Chat.create(chatData);

      //Accessing that newly created chat and sending as response
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (error) {}
  }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
  //This Api is for just fectch all the chats for that particular user to logged in

  try {
    //we are just geeting the chat and populating needed data and sorting that new chat will come up

    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      selecr: "name pic email",
    });

    res.status(200).send(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//This creategroup chat will get the users and groupname and we will create a group
const createGroupChat = expressAsyncHandler(async (req, res) => {
  //checking requireds are there or not
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the Fields" });
  }

  //front frontend we will get the data in javascript object formate we need to convert to the json formate to put into database
  let users = JSON.parse(req.body.users);

  //A group chat must have more that 2 users if not throw error
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are reuired to form a group chat");
  }

  //Note:In a group current logged in user is also participant as admin
  //pushing current also in group
  users.push(req.user);

  try {
    //creating a new group
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    //fetching that newly created chat
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//This API will just Rename this group Name
const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    { new: true }
  );

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(updatedChat);
  }
});

//This Api is to add a new user in the existing group
const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  //just simply getting the group and pushing the new user in that group
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not found");
  } else {
    res.json(added);
  }
});

//This API is to remove the specific user from the existing group
const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  //just simply getting the group and pull(removed) the new user in that group
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
