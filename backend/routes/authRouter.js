const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("name").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  register
);

authRouter.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  login
);

module.exports = authRouter;
