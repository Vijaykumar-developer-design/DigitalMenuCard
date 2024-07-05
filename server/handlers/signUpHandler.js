const { UserModel } = require("../models/User");
const bcrypt = require("bcrypt");

const signUpHandler = async (req, res) => {
  try {
    const { userId, hotelName, email, password } = req.body;
    // console.log(req.body);
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with given email" });
    }

    // If the user doesn't exist, proceed with user creation
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      userId,
      hotelName,
      email,
      password: hashPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    return res.json({ success: "User Created Successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    // Check for duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Emailis already in use. Please use a different email.",
      });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = signUpHandler;
