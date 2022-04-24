import Category from "../../models/category/Category.js";
import validateMongoDbID from "../../utils/validateMongoDbID.js";
import { StatusCodes } from "http-status-codes";

//----------------------------------------------------------------
// Create Category
//----------------------------------------------------------------
const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.status(StatusCodes.CREATED).json(category);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
// Fetch All Categories
//----------------------------------------------------------------
const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("-createdAt");
    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
// Fetch Single Category
//----------------------------------------------------------------
const fetchCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const category = await Category.findById(id);
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res.json(error);
  }
  res.json("Fetch Category");
};

//----------------------------------------------------------------
// Update Category
//----------------------------------------------------------------
const updateCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req.body?.title,
      },
      { new: true, runValidation: true }
    );
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
// Delete Category
//----------------------------------------------------------------
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);

  try {
    const category = await Category.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res.json(error);
  }
};

export {
  createCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
  deleteCategory,
};
