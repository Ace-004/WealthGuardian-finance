const { validationResult } = require("express-validator");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ user: { id: user.id, name, email }, token });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ user: { id: user.id, name: user.name, email }, token });
  } catch (e) {
    next(e);
  }
};

module.exports = { register, login };
