import express from "express";
import { sendEmail } from "../controllers/emailMessage/emailMessageController.js";
import { authenticateUser } from "../middlewares/auth/authentication.js";

const router = express.Router();

router.route("/").post(authenticateUser, sendEmail);

export default router;
