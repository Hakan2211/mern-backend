import express from "express";
import { authenticateUser } from "../middlewares/auth/authentication.js";

const router = express.Router();

import {
  register,
  login,
  logout,
  generateVerificationToken,
  accountVerification,
  forgetPasswordToken,
  passwordReset,
} from "../controllers/auth/authController.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/generate-verify-email-token")
  .post(authenticateUser, generateVerificationToken);
router.route("/verify-account").patch(authenticateUser, accountVerification);
router.route("/forget-password").post(authenticateUser, forgetPasswordToken);
router.route("/reset-password").patch(authenticateUser, passwordReset);

export default router;
