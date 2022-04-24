import express from "express";
import {
  createPost,
  fetchPosts,
  fetchPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
} from "../controllers/posts/postController.js";
import { authenticateUser } from "../middlewares/auth/authentication.js";
import {
  photoUploadMiddle,
  postImgResize,
} from "../middlewares/uploads/photoUpload.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateUser,
    photoUploadMiddle.single("image"),
    postImgResize,
    createPost
  )
  .get(fetchPosts);

router.route("/likes").patch(authenticateUser, likePost);
router.route("/dislikes").patch(authenticateUser, dislikePost);

router
  .route("/:id")
  .get(fetchPost)
  .patch(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost);

export default router;
