import User from "../../models/user/User.js";
import { generateToken } from "../../utils/token/generateToken.js";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//----------------------------------------------------------------
//Register User
//----------------------------------------------------------------
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExistsAlready = await User.findOne({ email });
  if (userExistsAlready) {
    throw new Error("User already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  res.status(StatusCodes.CREATED).json({ user });
};

//----------------------------------------------------------------
//Login User
//----------------------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please provide Email and Password.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(
      "Inavalid credentials. Please register an account before logging in."
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid Credentials");
  } else {
    res.status(StatusCodes.OK).json({
      _id: user?._id,
      name: user?.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin,
      token: generateToken(user?._id),
    });
  }
};

//----------------------------------------------------------------
//Account Verification - Send Mail
//----------------------------------------------------------------

const generateVerificationToken = async (req, res) => {
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  try {
    const verificationToken = await user.createAccountVerificationToken();
    await user.save();

    const resetURL = `If you were requested to verify your account, verify now within 30 minutes, otherwise ignore this.message <a href="http://localhost:3000/verify-account/${verificationToken}">Verify your Account</a>`;
    const msg = {
      to: "hbilgic1992@gmail.com", // Change to your recipient
      from: "hbilgic777@gmail.com", // Change to your verified sender
      subject: "Klausurvorbereitung",
      text: "Ich schicke Dir die Alkklausuren.",
      html: resetURL,
    };
    await sgMail.send(msg);
    res
      .status(StatusCodes.OK)
      .json("Email was sent")

      .catch((error) => {});
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
//Account Verification
//----------------------------------------------------------------

const accountVerification = async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!userFound) throw new Error("Token expired, try again later.");
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;

  await userFound.save();

  res.status(StatusCodes.ACCEPTED).json(userFound);
};

//----------------------------------------------------------------
// Forget Password - Generate Token
//----------------------------------------------------------------
const forgetPasswordToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not Found");

  try {
    const token = await user.createPasswordToken();

    await user.save();

    const resetURL = `If you were requested to reset your password, reset now within 30 minutes, otherwise ignore this.message <a href="http://localhost:3000/reset-password/${token}">Reset your password</a>`;
    const msg = {
      to: "hbilgic1992@gmail.com", // Change to your recipient
      from: "hbilgic777@gmail.com", // Change to your verified sender
      subject: "Reset password",
      text: "Ich schicke Dir die Alkklausuren.",
      html: resetURL,
    };
    await sgMail.send(msg);
    res.status(StatusCodes.OK).json({
      msg: `A reset message is successfully sent to ${user?.email}. Please reset within 10 minutes.`,
    });
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
// Reset Password
//----------------------------------------------------------------

const passwordReset = async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, try again later.");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(StatusCodes.OK).json(user);
};

const logout = async (req, res) => {};
export {
  register,
  login,
  logout,
  generateVerificationToken,
  accountVerification,
  forgetPasswordToken,
  passwordReset,
};
