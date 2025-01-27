const path = require("path");
const { UserModel, PostModel } = require("../models/User");
const cloudinary = require("../middlewares/cloudinaryConfig");

const menuItemHandler = async (req, res) => {
  try {
    const { name, price, userId } = req.body;
    // console.log("Uploaded file:", req.file);

    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    let uploadImage;
    let publicId;

    try {
      // Convert the buffer to a stream and upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "uploads" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      uploadImage = result.secure_url;
      publicId = result.public_id;
      // console.log("Cloudinary URL:", uploadImage);
    } catch (uploadError) {
      console.error("Error uploading image to Cloudinary:", uploadError);
      return res.status(500).json({ error: "Image upload failed" });
    }

    // Find the user by userId
    const existedUser = await UserModel.findOne({ userId });

    if (!existedUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Create a new post document
    const newPost = new PostModel({
      userId,
      name,
      price,
      uploadImage,
      publicId, // Use Cloudinary URL for uploadImage field
    });

    try {
      // Save the new post to the database
      await newPost.save();
    } catch (saveError) {
      console.error("Error saving new post to database:", saveError.message);
      return res
        .status(500)
        .json({ error: "Failed to save new post", details: saveError.message });
    }

    await existedUser.save();

    res.status(200).json({ msg: "Successfully uploaded", user: existedUser });
  } catch (error) {
    console.error("Error while adding item:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = menuItemHandler;

// const path = require("path");
// const { UserModel, PostModel } = require("../models/User");

// const menuItemHandler = async (req, res) => {
//   try {
//     const { name, price, userId } = req.body;
//     // console.log("userId=>", req.body);
//     let uploadImage;

//     // Check if an image was uploaded
//     if (req.file) {
//       uploadImage = req.file.filename;
//     } else {
//       return res.status(400).json({ error: "No image uploaded" });
//     }
//     const imageUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/uploads/${uploadImage}`;
//     // Find the user by userId
//     const existedUser = await UserModel.findOne({ userId });

//     if (!existedUser) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     // Create a new post document
//     const newPost = new PostModel({
//       userId,
//       name,
//       price,
//       imageUrl: uploadImage,
//       uploadImage: imageUrl, // Assuming PostModel has uploadImage field
//       user: existedUser._id, // Assuming user field in PostModel references UserModel
//     });

//     // Save the new post to the database
//     await newPost.save();

//     // Update user's uploadImage
//     // existedUser.uploadImage = uploadImage;
//     await existedUser.save();

//     res.status(200).json({ msg: "Successfully uploaded", user: existedUser });
//   } catch (error) {
//     console.error("Error while adding item:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = menuItemHandler;
