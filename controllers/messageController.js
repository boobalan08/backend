const Message = require("../models/Message");
const { Op } = require("sequelize");
const User = require("../models/user");

const myMsg = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      order: [["createdAt", "ASC"]],
    });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

const userMessageList = async (req, res) => {
    const { userId } = req.params; 
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
  
    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: req.user.id, receiverId: userId }, 
            { senderId: userId, receiverId: req.user.id }, 
          ],
        },
        order: [["createdAt", "ASC"]],
      });
  
      res.json({ success: true, messages });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching messages",
        error: error.message,
      });
    }
  };

  const getUsersWithMessages = async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          id: {
            [Op.ne]: req.user.id,  // Exclude the current user
          },
        },
        attributes: ["id", "username"], // Return only user id and username
      });
      res.json({ success: true, users });
    } catch (error) {
      console.log(req.user);
      res.status(500).json({
        success: false,
        message: "Error fetching users with messages",
        error: error.message,
      });
    }
  };
  

module.exports = { myMsg, userMessageList, getUsersWithMessages };
