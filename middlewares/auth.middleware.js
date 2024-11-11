import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  // const { token } = req.cookies;
  const token = req.header("Authorization");

  if (!token)
    return next(new AppError("Unauthenticated, please login again", 401));
  const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = userDetails;
  next();
};

const authorizeRoles =
  (...roles) =>
  async (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!roles.includes(currentUserRole)) {
      return next(
        new AppError("You do not have permission to view this route", 403)
      );
    }
    next();
  };

const authorizeSubscribers = async (req, _res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("Please try again", 404));
  }

  if (user.role !== "ADMIN" && user.subscription.status !== "active") {
    return next(new AppError("Please subscribe to access this route.", 403));
  }

  next();
};
export { isLoggedIn, authorizeRoles, authorizeSubscribers };
