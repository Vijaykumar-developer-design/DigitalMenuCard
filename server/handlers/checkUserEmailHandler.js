const { UserModel } = require("../models/User");
const checkUserEmailHandler = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.json({ msg: "success" });
    } else {
      res.json({ msg: "fail" });
    }
  } catch (error) {
    console.error("Error while checking user email:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = checkUserEmailHandler;
