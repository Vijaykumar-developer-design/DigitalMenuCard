const { UserModel } = require("../models/User"); // Adjust the path according to your project structure

const markOrderCompleted = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    // Find the user by userId
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the order by orderId
    const order = user.orders.find((order) => order._id.toString() === orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Mark the order as completed
    order.completed = true;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Order marked as completed" });
  } catch (error) {
    console.error("Error marking order as completed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = markOrderCompleted;
