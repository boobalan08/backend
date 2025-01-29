const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/auth");
const {
  signIn,
  signUp,
  resetPassword,
} = require("../controllers/authController");

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/reset-password", resetPassword);
router.get("/me", authenticateUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
