import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utiles/TryCatch.js";
import generateToken from "../utiles/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User Already Exists",
    });

  const hasPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hasPassword,
  });
  generateToken(user._id, res);
  res.status(201).json({
    user,
    message: "User created successfuly!",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No user find with this email ID",
    });

  const comparePass = await bcrypt.compare(password, user.password);

  if (!comparePass)
    return res.status(400).json({
      message: "No, Password is wrong, Please try again!!",
    });

  generateToken(user._id, res);

  res.json({
    user,
    message: "User login successfuly!",
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});
export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

export const followAndUnfollow = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!user)
    return res.status(400).json({
      message: "No user with this ID",
    });

  // Fix the condition: remove the extra '!'
  if (user._id.toString() === loggedInUser._id.toString())
    return res.status(400).json({
      message: "You can not follow yourself.",
    });

  if (user.followers.includes(loggedInUser._id)) {
    // Unfollow logic
    const indexFollowing = loggedInUser.following.indexOf(user._id);
    const indexFollowers = user.followers.indexOf(loggedInUser._id);

    loggedInUser.following.splice(indexFollowing, 1);
    user.followers.splice(indexFollowers, 1);

    await loggedInUser.save();
    await user.save();
    res.json({
      message: "User unfollowed",
    });
  } else {
    // Follow logic
    loggedInUser.following.push(user._id);
    user.followers.push(loggedInUser._id);

    await loggedInUser.save();
    await user.save();
    res.json({
      message: "User followed",
    });
  }
});

export const logOutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  res.json({
    message: "User logged out successfuly!",
  });
});
