const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");

const router = express.Router();

//To post the chat content  for the particluar chat
router.route("/").post(authMiddleware.protect, messageController.sendMessage);

//To get all the chats content  for the particluar chat
router
  .route("/:chatId")
  .get(authMiddleware.protect, messageController.allMessages);

module.exports = router;
