import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "@/Models/User";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

// Helper function for token creation
export const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// REST API Controllers
export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(user, 201, res);
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password!",
    });
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "No user found with that email",
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  user.passwordResetOTP = otp;
  user.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Note: In a real implementation, you would send the OTP via email
  // For now, we'll just return success
  res.status(200).json({
    status: "success",
    message: "OTP sent to email",
  });
};

export const verifyOTPController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    passwordResetOTP: otp,
    passwordResetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid or expired OTP",
    });
  }

  user.passwordResetOTP = undefined;
  user.passwordResetOTPExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "OTP verified. You can reset your password now.",
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { email, password, passwordConfirm } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User not verified or does not exist",
    });
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
};
