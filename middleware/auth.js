import jwt from "jsonwebtoken";
import Users from "../model/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token || token === "loggedout") {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await Users.findById(decoded.id);
    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "The user belonging to this token no longer exists" });
    }

    req.user = currentUser; // available to every controller downstream
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
