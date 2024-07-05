// handlers/getOrdersHandler.js
const { UserModel } = require("../models/User");

const getOrdersHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ orders: user.orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getOrdersHandler;
