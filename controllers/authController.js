const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/user");
const { Op } = require("sequelize");
const JWT_SECRET = process.env.JWT_SECRET;

// Validation Schemas using Joi

// Sign In validation schema
const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a string",
    "string.min": "Password should be at least 6 characters",
    "any.required": "Password is required",
  }),
});

// Sign Up validation schema
const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a string",
    "string.min": "Username should be at least 3 characters",
    "string.max": "Username should be at most 30 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a string",
    "string.min": "Password should be at least 6 characters",
    "any.required": "Password is required",
  }),
});

// Reset Password validation schema
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

const signIn = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  const { error } = signInSchema.validate({ email, password });
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isValid);
    if (!isValid)
      return res
        .status(400)
        .send({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ success: true, message: "Login successful", token, user });
  } catch (err) {
    res.status(500).send({ message: "Error logging in", error: err.message });
  }
};

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate request body using Joi
  const { error } = signUpSchema.validate(
    { username, email, password },
    { abortEarly: false }
  );

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => ({
        field: err.path[0], // Extracts the field name
        message: err.message,
      })),
    });
  }

  try {
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: [
          { field: "email", message: "Username or email already in use" },
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate request body
  const { error } = resetPasswordSchema.validate({ email, newPassword });
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User with this email not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: err.message,
    });
  }
};

module.exports = {
  signIn,
  signUp,
  resetPassword,
};
