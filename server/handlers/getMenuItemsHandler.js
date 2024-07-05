const { UserModel, PostModel } = require("../models/User");
const getMenuItemsHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findOne({ userId: userId });
    if (user) {
      const itemsList = await PostModel.find({ userId: userId })
        .sort({ _id: -1 })
        .select("-__v")
        .exec();
      //   console.log(itemsList);
      res.json({ itemsList: itemsList });
    } else {
      res.json({ msg: "User Not Found" });
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = getMenuItemsHandler;
