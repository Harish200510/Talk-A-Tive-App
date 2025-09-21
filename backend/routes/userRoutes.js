const express = require("express");
const userController = require("./../controllers/userController");
const router = express.Router();
const authMiddleware = require("./../middlewares/authMiddleware");

//to chain multiple request

router
  .route("/")
  .post(userController.registerUser)
  .get(authMiddleware.protect, userController.allUsers);
router.post("/login", userController.authUser);

module.exports = router;
