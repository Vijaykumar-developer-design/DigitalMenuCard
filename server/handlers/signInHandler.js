const { UserModel } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const signInHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ error: "User Not found" });
    }

    // Verify password
    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // Generate JWT token
    const payload = { email: existingUser.email };
    const jwtToken = jwt.sign(payload, secretKey);

    return res.status(200).json({
      jwt_token: jwtToken,
      userId: existingUser.userId,
    });
  } catch (error) {
    console.error("Error signing in:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = signInHandler;
