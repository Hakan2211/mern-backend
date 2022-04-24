import express from "express";
import {
  createCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category/categoryController.js";
import { authenticateUser } from "../middlewares/auth/authentication.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createCategory)
  .get(authenticateUser, fetchCategories);

router
  .route("/:id")
  .get(authenticateUser, fetchCategory)
  .patch(authenticateUser, updateCategory)
  .delete(authenticateUser, deleteCategory);

export default router;
