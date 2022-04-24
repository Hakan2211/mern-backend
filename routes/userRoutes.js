import express from "express";

const router = express.Router();

import {
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
} from "../controllers/users/userController.js";

import { authenticateUser } from "../middlewares/auth/authentication.js";
import {
  photoUploadMiddle,
  profilePhotoResize,
} from "../middlewares/uploads/photoUpload.js";

router.route("/").get(authenticateUser, getAllUsers);
router.route("/password").patch(authenticateUser, updateUserPassword);
router
  .route("/profilephoto-upload")
  .patch(
    authenticateUser,
    photoUploadMiddle.single("image"),
    profilePhotoResize,
    profilePhotoUpload
  );
router.route("/follow").patch(authenticateUser, followingUser);
router.route("/unfollow").patch(authenticateUser, unfollowingUser);

router.route("/block-user/:id").patch(authenticateUser, blockUser);
router.route("/unblock-user/:id").patch(authenticateUser, unblockUser);

router.route("/profile/:id").get(authenticateUser, userProfile);
router.route("/:id").patch(authenticateUser, updateUser).get(getSingleUser);
router.route("/delete/:id").delete(deleteUser);

export default router;
