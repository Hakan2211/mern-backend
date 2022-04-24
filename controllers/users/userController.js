import User from "../../models/user/User.js";
import cloudinaryUploadImg from "../../utils/cloudinary.js";
import validateMongoDbID from "../../utils/validateMongoDbID.js";
import fs from "fs";

//----------------------------------------------------------------
// Fetch All Users
//----------------------------------------------------------------
const getAllUsers = async (req, res) => {
  console.log(req.headers);
  const users = await User.find({});
  res.json(users);
};

//----------------------------------------------------------------
// Fetch Single User
//----------------------------------------------------------------
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  const user = await User.findById(id);
  res.json(user);
};

//----------------------------------------------------------------
// Delete User
//----------------------------------------------------------------

const deleteUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  const deletedUser = await User.findByIdAndDelete(id);
  res.json(deletedUser);
};

//----------------------------------------------------------------
//User Profile
//----------------------------------------------------------------
const userProfile = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbID(id);
    const myProfile = await User.findById(id).populate("posts");
    res.json(myProfile);
  } catch (error) {
    res.json(error.message);
  }
};

const updateUser = async (req, res) => {
  const { _id } = req?.user;
  validateMongoDbID(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
    },
    { new: true, runValidators: true }
  );

  res.json(user);
};

const updateUserPassword = async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbID(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
  return;
};

//----------------------------------------------------------------
//Upload User Profile Picture
//----------------------------------------------------------------
const profilePhotoUpload = async (req, res) => {
  const { _id } = req.user;

  const localPath = `public/images/profile/${req.file.filename}`;
  const imgUploaded = await cloudinaryUploadImg(localPath, "Profile");
  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePicture: imgUploaded?.url,
    },
    { new: true }
  );
  fs.unlinkSync(localPath);
  res.json(imgUploaded);
};

//----------------------------------------------------------------
//Following Users
//----------------------------------------------------------------
const followingUser = async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  const targetUser = await User.findById(followId);
  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) throw new Error("You have already follwed this user.");

  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );

  res.json("You have successfully followed this user");
};

//----------------------------------------------------------------
//Unfollowing User
//----------------------------------------------------------------
const unfollowingUser = async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    { new: true }
  );

  res.json("You have successfully unfollowed this user.");
};

//----------------------------------------------------------------
//Block User
//----------------------------------------------------------------
const blockUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.json(user);
};

//----------------------------------------------------------------
//Unblock User
//----------------------------------------------------------------

const unblockUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.json(user);
};

export {
  getAllUsers,
  deleteUser,
  getSingleUser,
  userProfile,
  updateUser,
  updateUserPassword,
  followingUser,
  unfollowingUser,
  blockUser,
  unblockUser,
  profilePhotoUpload,
};
