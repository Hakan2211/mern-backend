import express from "express";
import {
  createComment,
  fetchComments,
  fetchComment,
  updateComment,
  deleteComment,
} from "../controllers/comments/commentController.js";
import { authenticateUser } from "../middlewares/auth/authentication.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createComment)
  .get(authenticateUser, fetchComments);

router
  .route("/:id")
  .get(authenticateUser, fetchComment)
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);

export default router;
