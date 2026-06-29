import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/auth.models.js";
import validator from "validator"
import { generateToken } from "../utils/generatetokens.js";

const router = express.Router();

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 2. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // 3. Check password length (optional but recommended)
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // 5. Hash password
    const hash = await bcrypt.hash(password, 10);

    // 6. Create user
    const user = await User.create({
      name,
      email,
      password: hash,
    });

    // 7. Hide password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      msg: "User registered successfully",
      user: userResponse,
    });

  } catch (err) {
    // 8. Handle duplicate key error (extra safety)
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Wrong password" });

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

