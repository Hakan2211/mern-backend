import Post from "../../models/post/Post.js";
import validateMongoDbID from "../../utils/validateMongoDbID.js";
import Filter from "bad-words";
import User from "../../models/user/User.js";
import cloudinaryUploadImg from "../../utils/cloudinary.js";
import fs from "fs";
import { StatusCodes } from "http-status-codes";

//----------------------------------------------------------------
//Create Post
//----------------------------------------------------------------
const createPost = async (req, res) => {
  const { _id } = req.user;
  //validateMongoDbID(req.body.user);
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating failed because it contains profane words and you have been blocked."
    );
  }

  const localPath = `public/images/posts/${req.file.filename}`;
  const imgUploaded = await cloudinaryUploadImg(localPath, "Post");

  try {
    const post = await Post.create({
      ...req.body,
      image: imgUploaded?.url,
      user: _id,
    });
    res.status(StatusCodes.CREATED).json(post);

    //Remove Uploaded Images
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Fetch Posts
//----------------------------------------------------------------

const fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user");
    res.status(StatusCodes.OK).json(posts);
  } catch (error) {}
};

//----------------------------------------------------------------
//Fetch Single Post
//----------------------------------------------------------------
const fetchPost = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);

  try {
    const post = await Post.findById(id)
      .populate("user")
      .populate("likes")
      .populate("dislikes");

    //Number of Views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Update Post
//----------------------------------------------------------------

const updatePost = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Delete Post
//----------------------------------------------------------------
const deletePost = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const post = await Post.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Like Post
//----------------------------------------------------------------
const likePost = async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);

  const loginUserId = req.user?._id;
  const isLiked = post?.isLiked;
  const alreadyDisliked = post?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(post);
  }

  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(post);
  }
};

//----------------------------------------------------------------
//Dislike Post
//----------------------------------------------------------------

const dislikePost = async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);

  const loginUserId = req.user?._id;
  const isDisliked = post?.isDisLiked;
  const alreadyLiked = post?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(post);
  }

  //Toggling dislikes
  if (isDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(post);
  }
};

export {
  createPost,
  fetchPosts,
  fetchPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
};
