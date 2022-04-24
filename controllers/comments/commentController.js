import Comment from "../../models/comment/Comment.js";
import validateMongoDbID from "../../utils/validateMongoDbID.js";
import { StatusCodes } from "http-status-codes";

//----------------------------------------------------------------
//Create Comment
//----------------------------------------------------------------
const createComment = async (req, res) => {
  const user = req.user;
  const { postId, description } = req.body;

  try {
    const comment = await Comment.create({
      post: postId,
      user: user,
      description: description,
    });
    res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {}
};

//----------------------------------------------------------------
//Fetch all Comments
//----------------------------------------------------------------

const fetchComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-created");
    res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Fetch Single Comment
//----------------------------------------------------------------
const fetchComment = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const comment = await Comment.findById(id);
    res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Update Comment
//----------------------------------------------------------------
const updateComment = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        post: req.body.postId,
        user: req.user,
        description: req.body?.description,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Delete Comment
//----------------------------------------------------------------
const deleteComment = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    res.json(error);
  }
};

export {
  createComment,
  fetchComments,
  fetchComment,
  updateComment,
  deleteComment,
};
