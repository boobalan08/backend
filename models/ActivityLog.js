module.exports = (sequelize, DataTypes) => {
    const ActivityLog = sequelize.define("ActivityLog", {
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    // Associations
    ActivityLog.associate = (models) => {
      ActivityLog.belongsTo(models.User);
    };
  
    return ActivityLog;
  };
  