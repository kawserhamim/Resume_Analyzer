import bcrypt from "bcryptjs";
import User from "../models/auth.models.js";
import validator from "validator";
import { generateToken } from "../utils/generatetokens.js";

const BCRYPT_ROUNDS = 12;

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required", msg: "All fields are required" });
    }

    // 2. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format", msg: "Invalid email format" });
    }

    // 3. Enforce strong password policy (min 8 chars)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters", msg: "Password must be at least 8 characters" });
    }

    // 4. Check if user already exists (use normalised lowercase email)
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered", msg: "Email already registered" });
    }

    // 5. Hash password with stronger salt rounds
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 6. Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hash,
    });

    // 7. Strip password before responding
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      msg: "User registered successfully",
      user: userResponse,
    });
  } catch (err) {
    // Handle duplicate key error (extra safety for race conditions)
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already registered", msg: "Email already registered" });
    }

    console.error("Register error:", err);
    // Never expose raw err.message to the client
    return res.status(500).json({ success: false, message: "Server error", msg: "Server error" });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required", msg: "Email and password are required" });
    }

    // Always normalise email to lowercase before lookup
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    // Use a deliberately vague message to avoid user-enumeration
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials", msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials", msg: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error", msg: "Server error" });
  }
};
