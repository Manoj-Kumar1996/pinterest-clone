import { Pin } from "../models/pinModel.js";
import TryCatch from "../utiles/TryCatch.js";
import getDataUrl from "../utiles/urlGenerator.js";
import cloudinary from "cloudinary";

export const createPin = TryCatch(async (req, res) => {
  const { title, pin } = req.body;

  const file = req.file;
  if (!file)
    return res.status(400).json({
      message: "Please upload an image.",
    });

  const fileUrl = getDataUrl(file);
  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });

  res.json({
    message: "Pin created",
  });
});

export const getAllPins = TryCatch(async (req, res) => {
  const allPins = await Pin.find().sort({ createdAt: -1 });

  res.json({
    message: allPins,
  });
});

export const getSinglePin = TryCatch(async (req, res) => {
  const singlePin = await Pin.findById(req.params.id).populate(
    "owner",
    "-password"
  );

  res.json({
    message: singlePin,
  });
});

export const commentOnPin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No pin with this ID",
    });

  pin.comments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await pin.save();

  res.json({
    message: "Comment added",
  });
});

export const deleteComment = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No pin with this ID",
    });

  if (!req.query.commentId)
    return res.status(404).json({
      message: "Please comment ID",
    });

  const commentIndex = pin.comments.findIndex(
    (item) => item._id.toString() === req.query.commentId.toString()
  );

  if (commentIndex === -1) {
    return res.status(404).json({
      message: "Comment is not found",
    });
  }

  const comment = pin.comments[commentIndex];

  if (comment.user.toString() === req.user._id.toString()) {
    pin.comments.splice(comment, 1);
    await pin.save();
    return res.json({
      message: "Comment is deleted successfuly!",
    });
  } else {
    return res.status(403).json({
      message: "You not authorise to delete this comment.",
    });
  }
});

export const deletePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin) {
    return res.status(400).json({
      message: "No pin found with this Id",
    });
  }

  if (pin.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Oops! You are not the owner of this pin.",
    });
  }
  
  try {
    await cloudinary.v2.uploader.destroy(pin.image.id);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }

  await pin.deleteOne();

  res.json({
    message: "Pin deleted successfully!",
    deletedImageId: pin.image.id
  });
});

export const updatePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No pin with this Id",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  pin.title = req.body.title;
  pin.pin = req.body.pin;

  await pin.save();

  res.json({
    message: "Your pin is updated successfuly!",
  });
});
