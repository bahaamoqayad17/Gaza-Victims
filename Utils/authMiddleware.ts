import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "@/Models/User";
import AppError from "./AppError";
import CatchAsync from "./CatchAsync";

// Extended Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Authentication middleware for REST API
export const protect = CatchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    // 4) Check if user changed password after the token was issued
    if (
      currentUser.changedPasswordAfter &&
      currentUser.changedPasswordAfter(decoded.iat)
    ) {
      return res.status(401).json({
        status: "fail",
        message: "User recently changed password! Please log in again.",
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  }
);

// Authorization middleware
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

export default { protect, restrictTo };
