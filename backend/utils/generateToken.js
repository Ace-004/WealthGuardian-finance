const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { sub: user.id, role: user.role || "user" },
    process.env.JWT_SECRET,
    {
      expiresIn: "600s",
    }
  );
};

module.exports = generateToken;
