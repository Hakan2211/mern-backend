import jwt from "jsonwebtoken";
import User from "../../models/user/User.js";

const authenticateUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id).select("-password");
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token. Login again.");
    }
  } else {
    throw new Error("There is no token to the header.");
  }
};

export { authenticateUser };
