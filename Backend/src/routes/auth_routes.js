import express from "express";
import bcrypt from "bcryptjs";
import {register, login} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);




export default router;