import { User } from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
  const { fullName,email, password } = req?.body;

  const profilePic = req?.files?.profilePic
    ? `uploads/${req.files.profilePic[0].filename}`
    : undefined; // Leave undefined to use the default value from the model


  const userExist = await User.findOne({ fullName });
  if (userExist) {
    return res.status(400).json({
      message: "username already exist",
    });
  }

  const user = new User({
    fullName,
    password,
    profilePic,
    email,
  });

  if (user) {
    await user.save();
    return res.status(200).json({
      message: "user created succesfully",
      data: user,
    });
  } else {
    return res.status(400).json({ message: "invalid data " });
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ email: username });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  if (user.password === password) {
    res.status(200).json({
      message: "login succesfully",
      _id: user._id,
      username: user.userName,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: " failed to login " });
  }
});

const getuser = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (users.length > 0) {
    return res.status(200).json({
      message: "user featch succesfully",
      data: users,
    });
  } else {
    return res.status(404).json({ message: "user not found" });
  }
});

export { createUser, login, getuser };
