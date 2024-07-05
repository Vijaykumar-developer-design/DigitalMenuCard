const { UserModel, PostModel } = require("../models/User");
const getDataHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findOne({ userId: userId });
    const menuList = await PostModel.find({ userId: userId })
      .sort({ _id: -1 })
      .select("-__v")
      .exec();
    if (user) {
      res.json({ hotel: user.hotelName, menuList: menuList });
    } else {
      res.json({ msg: "User Not Found" });
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = getDataHandler;
