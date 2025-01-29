const express = require("express");
const authenticateUser = require("../middlewares/auth");
const {
  myMsg,
  getUsersWithMessages,
  userMessageList,
} = require("../controllers/messageController");
const router = express.Router();

router.get("/", authenticateUser, myMsg);
router.get("/user/:id", authenticateUser, userMessageList);
router.get("/users", authenticateUser, getUsersWithMessages);
module.exports = router;
