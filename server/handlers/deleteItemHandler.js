const cloudinary = require("../middlewares/cloudinaryConfig");
const { PostModel } = require("../models/User");

const deleteItemHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PostModel.findById({ _id: id });

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(item.publicId);
    console.log("Cloudinary response:", result);

    if (result.result === "not found") {
      console.log("Image not found on Cloudinary:", result);
    } else {
      console.log("Image deleted successfully:", result);
    }

    // Delete item from database regardless of Cloudinary result
    const deleteResult = await PostModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 1) {
      res.json({ msg: "Successfully Deleted Your Item" });
    } else {
      res.status(404).json({ msg: "Post Not Found or Already Deleted" });
    }
  } catch (error) {
    console.error("Error deleting Item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = deleteItemHandler;

// for static file serve
// const path = require("path");
// const fs = require("fs");
// const { PostModel } = require("../models/User");

// const deleteItemHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const item = await PostModel.findById(id);

//     if (!item) {
//       return res.status(404).json({ msg: "Item not found" });
//     }
//     const result = await PostModel.deleteOne({ _id: id });
//     if (result.deletedCount === 1) {
//       const imagePath = path.join(__dirname, "../uploads/", item.imageUrl);

//       // Delete the image file from the uploads folder
//       fs.unlink(imagePath, (err) => {
//         if (err) {
//           console.error("Error deleting image:", err);
//         } else {
//           console.log("Image deleted successfully");
//         }
//       });
//       res.json({ msg: "Successfully Deleted Your Item" });
//     } else {
//       res.json({ msg: "Post Not Found or Already Deleted" });
//     }
//   } catch (error) {
//     console.error("Error deleting Item:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = deleteItemHandler;
