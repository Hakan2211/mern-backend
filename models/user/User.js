import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "Name is required"],
      type: String,
      minLength: 3,
      maxlength: 20,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2018/11/19/00/30/head-3824362_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    bio: { type: String },
    password: { type: String, required: [true, "Password is required"] },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    postCount: { type: Number, default: 0 },

    isBlocked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["Admin", "User", "Guest", "Blogger"],
      default: "User",
    },
    isFollowing: { type: Boolean, default: false },
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//----------------------------------------------------------------
//Virtual Method to populaste created post
//----------------------------------------------------------------
UserSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

//----------------------------------------------------------------
//Hash Password
//----------------------------------------------------------------
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//----------------------------------------------------------------
//Compare Passord
//----------------------------------------------------------------
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//----------------------------------------------------------------
//Verify Account
//----------------------------------------------------------------

UserSchema.methods.createAccountVerificationToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;

  return verificationToken;
};

//----------------------------------------------------------------
//Reset Password (Forget Password)
//----------------------------------------------------------------
UserSchema.methods.createPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

export default mongoose.model("User", UserSchema);
