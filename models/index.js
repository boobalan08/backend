const Sequelize = require("sequelize");
const sequelize = require("../config/config");

// Import models
const User = require("./user");
const Message = require("./Message");
const ActivityLog = require("./ActivityLog");

// Set up associations
User.hasMany(Message, { foreignKey: "senderId", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "ReceivedMessages" });

Message.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });

User.hasMany(ActivityLog, { foreignKey: "userId", as: "ActivityLogs" });
ActivityLog.belongsTo(User, { foreignKey: "userId", as: "User" });

module.exports = {
  User,
  Message,
  ActivityLog,
  sequelize,
};
