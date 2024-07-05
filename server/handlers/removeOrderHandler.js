const { UserModel } = require("../models/User"); // Adjust the path according to your project structure

const removeOrderHandler = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    // Find the user by userId
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the order by orderId and remove it
    const orderIndex = user.orders.findIndex(
      (order) => order._id.toString() === orderId
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Remove the order from the orders array
    user.orders.splice(orderIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Order removed successfully" });
  } catch (error) {
    console.error("Error removing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = removeOrderHandler;
