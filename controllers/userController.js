const User = require("../models/user");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};

module.exports = { getAllUsers };