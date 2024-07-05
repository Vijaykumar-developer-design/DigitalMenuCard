const { UserModel } = require("../models/User");

const receiveOrdersHandler = async (req, res) => {
  try {
    const { userId, items, note, tableNumber, orderedTime, totalBill } =
      req.body;

    // Validate request body
    if (!userId || !items || !tableNumber || !orderedTime) {
      return res.status(400).json({ error: "Missing required order details" });
    }

    // Find the user by userId
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new order object
    const newOrder = {
      items,
      note,
      tableNumber,
      orderedTime: new Date(orderedTime),
      totalBill,
    };

    // Add the new order to the beginning of the user's orders array
    user.orders.unshift(newOrder);

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ msg: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = receiveOrdersHandler;
