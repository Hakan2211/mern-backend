import express from "express";
import dbConnect from "./config/db/dbConnect.js";
import dotenv from "dotenv";
import "express-async-errors";
import morgan from "morgan";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import emailRouter from "./routes/emailRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";

import errorHandler from "./middlewares/error/errorHandler.js";
import notFound from "./middlewares/error/notFound.js";

//Security Packages
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
dbConnect();

const app = express();
const PORT = process.env.PORT || 5000;

//If Rate Limiter behind Proxy - Set Proxy to 1
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/email", emailRouter);
app.use("/api/category", categoryRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`Server is running at port ${PORT}`));
