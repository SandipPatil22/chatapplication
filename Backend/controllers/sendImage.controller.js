import { Chat } from "../models/chat.model.js";
import { Image } from "../models/media.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// const sendImage = asyncHandler(async (req, res) => {
//   const { chatId } = req.params;
//   const senderId = req?.user?._id;

//   // check chat is exist or not
//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     return res.status(404).json({ message: "Chat not found" });
//   }

//   //  Check if files are present in req.files
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const imageFile = req.files.url[0];

//   const newImage = new Image({
//     url: imageFile.path, // Assuming your images are stored in the 'uploads' folder
//     filename: imageFile.filename,
//     size: imageFile.size,
//     chatId: chatId,
//     sender: senderId,
//   });

//   if (newImage) {
//     // save the image
//     await newImage.save();

//     // save the image id in the chat
//     chat.Images.push(newImage._id);
//     await chat.save();

//     res
//       .status(200)
//       .json({ message: "image sent succesfully", image: newImage });
//   } else {
//     res.status(400).json({ message: "failed to send the images " });
//   }
// });

const sendImage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const senderId = req?.user?._id;
  const { oneTime } = req.body; // Get the oneTime flag from the request body

  // check chat is exist or not
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  //  Check if files are present in req.files
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageFile = req.files.url[0];

  const newImage = new Image({
    url: imageFile.path, // Assuming your images are stored in the 'uploads' folder
    filename: imageFile.filename,
    size: imageFile.size,
    chatId: chatId,
    sender: senderId,
    oneTime: oneTime, // Save the oneTime flag
  });

  if (newImage) {
    // save the image
    await newImage.save();

    // save the image id in the chat
    chat.Images.push(newImage._id);
    await chat.save();

    res
      .status(200)
      .json({ message: "image sent succesfully", image: newImage });
  } else {
    res.status(400).json({ message: "failed to send the images " });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ message: "image id not found" });
  }

  const image = await Image.findById(id);

  if (image) {
    image.status = false;
    await image.save();
    res.status(200).json({ message: "image deleted succesfully", data: image });
  } else {
    res.status(404).json({ message: "image not found" });
  }
});

const getImageBychatId = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  // Find the chat by ID and populate the images related to that chat
  const chat = await Chat.findOne({ _id: chatId }).populate({
    path: "Images",
    match: { $or: [{ oneTime: false }, { viewed: false }] }, // Fetch images where oneTime is false or viewed is false
    select: "url createdAt sender oneTime viewed",
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  const images = chat.Images;

  // Handle one-time view logic
  const updatedImages = await Promise.all(
    images.map(async (image) => {
      if (image.oneTime && !image.viewed) {
        // Mark the image as viewed
        image.viewed = true;
        await image.save();

        return {
          _id: image._id,
          url: image.url,
          createdAt: image.createdAt,
          sender: image.sender,
          oneTime: image.oneTime,
        };
      }
      return {
        _id: image._id,
        url: image.url,
        createdAt: image.createdAt,
        sender: image.sender,
        oneTime: image.oneTime,
      };
    })
  );

  res
    .status(200)
    .json({ message: "Fetched images successfully", Images: updatedImages });
});

// const getImageBychatId = asyncHandler(async (req, res) => {
//   const { chatId } = req.params;

//   // Find the chat by ID and populate the images related to that chat
//   const chat = await Chat.findOne({ _id: chatId }).populate({
//     path: "Images",
//     select: "url createdAt sender oneTime viewed",
//   });

//   if (!chat) {
//     return res.status(404).json({ message: "Chat not found" });
//   }

//   const images = chat.Images;

//   // Separate images to be deleted from those to be kept
//   const imagesToDelete = [];
//   const imagesToKeep = [];

//   images.forEach((image) => {
//     if (image.oneTime && image.viewed) {
//       imagesToDelete.push(image._id);
//     } else {
//       imagesToKeep.push({
//         _id: image._id,
//         url: image.url,
//         createdAt: image.createdAt,
//         sender: image.sender,
//         oneTime: image.oneTime,
//         viewed: image.viewed,
//       });
//     }
//   });

//   // Delete the images with oneTime: true and viewed: true
//   if (imagesToDelete.length > 0) {
//     await Image.deleteMany({ _id: { $in: imagesToDelete } });
//   }
//   chat.Images = imagesToKeep;
//   // // Update the chat document to remove the deleted images
//   // chat.Images = chat.Images.filter(
//   //   (imageId) => !imagesToDelete.includes(imageId.toString())
//   // );
//   await chat.save();

//   // Return the images that are not deleted
//   res
//     .status(200)
//     .json({ message: "Fetched images successfully", Images: imagesToKeep });
// });

// const viewedImage = asyncHandler(async (req, res) => {
//   const { imageId } = req.params;

//   if (!imageId) {
//     return res.status(404).json({ message: "image id not found " });
//   }

//   const viewed = await Image.findByIdAndUpdate(
//     imageId,
//     { viewed: true },
//     { new: true }
//   );

//   if (viewed) {
//     res.status(200).json({ message: "image marked as viewed ", viewed });
//   } else {
//     return res.status(400).json({ message: "error to make image viewed " });
//   }
// });

const viewedImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;

  if (!imageId) {
    return res.status(404).json({ message: "Image ID not found" });
  }

  // Find the image without updating it first
  const image = await Image.findById(imageId);

  if (!image) {
    return res.status(400).json({ message: "Error finding the image" });
  }


  // Mark the image as viewed if it's not already
  if (!image.viewed) {
    image.viewed = true;
    await image.save();
  }

  // Check if the image has already been viewed and is a one-time image
  if (image.oneTime && image.viewed) {
    // Remove the image from the associated chat document first
    await Chat.updateOne(
      { _id: image.chatId }, // Find the chat by ID
      { $pull: { Images: image._id } } // Remove the image ID from the chat's Images array
    );

    // Then delete the image from the Image collection
    await Image.findByIdAndDelete(imageId);

    return res.status(200).json({ message: "Image viewed and deleted" });
  }

  // If the image has not been viewed yet, update the viewed field to true
  image.viewed = true;
  await image.save();

  // If it is a one-time image, delete it after marking it as viewed
  if (image.oneTime) {
    // Remove the image from the associated chat document first
    await Chat.updateOne({ _id: image.chat }, { $pull: { Images: image._id } });

    // Then delete the image from the Image collection
    await Image.findByIdAndDelete(imageId);

    return res
      .status(200)
      .json({ message: "Image marked as viewed and deleted" });
  }

  // Return the image data if it was not a one-time image
  res.status(200).json({ message: "Image marked as viewed", viewed: image });
});

export { sendImage, deleteImages, getImageBychatId, viewedImage };
