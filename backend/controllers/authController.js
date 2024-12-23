import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import express from "express";
import db from '../db/connection.js';

const router = express.Router();

// register user
router.post('/register', async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  try {
    // check if user already exists
    const user = await User.findOne({ username });
    const address = await User.findOne({ email });
    if (user) {
      console.log("username already exists");
      return res.status(400).json({ error: 'That username is taken' });
    }
    if (address) {
      console.log("email address already taken");
      return res.status(400).json({ error: 'That email address is taken' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    console.log("new user: ", newUser);
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    console.log("new user successfully registered");
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
    console.log(err)
  }
});

// login user
router.post('/login', async (req, res) => {
  console.log("login attempted");
  const {email, password } = req.body;
  try {
    // Find user
    console.log("attempting to find user");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");
      return res.status(400).json({ error: 'User not found' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("password incorrect");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    
    res.json({ token, userId: user._id });
    console.log(req.body);
    console.log("user successfully logged in");
    console.log(user._id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
