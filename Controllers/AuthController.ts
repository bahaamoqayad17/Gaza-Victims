import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/Models/User";
import CatchAsync from "@/Utils/CatchAsync";
import AppError from "@/Utils/AppError";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

// GraphQL-specific functions
export const createSendToken = (user: any) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  return {
    status: "success",
    token,
    data: {
      user,
    },
  };
};

export const register = async (input: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    passwordConfirm: input.passwordConfirm,
  });
  return createSendToken(user);
};

export const login = async (input: { email: string; password: string }) => {
  const { email, password } = input;

  // 1) Check if email and password exist
  if (!email || !password) {
    throw new Error("Please provide email and password!");
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new Error("Incorrect email or password");
  }

  // 3) If everything ok, send token to client
  return createSendToken(user);
};

export const forgotPassword = async (input: { email: string }) => {
  const { email } = input;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("No user found with that email");
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  user.passwordResetOTP = otp;
  user.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Note: In a real implementation, you would send the OTP via email
  // For now, we'll just return success
  return {
    status: "success",
    message: "OTP sent to email",
  };
};

export const verifyOTP = async (input: { email: string; otp: string }) => {
  const { email, otp } = input;
  const user = await User.findOne({
    email,
    passwordResetOTP: otp,
    passwordResetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  user.passwordResetOTP = undefined;
  user.passwordResetOTPExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return {
    status: "success",
    message: "OTP verified. You can reset your password now.",
  };
};

export const resetPassword = async (input: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  const { email, password, passwordConfirm } = input;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not verified or does not exist");
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: false });

  return createSendToken(user);
};

export const withAuth =
  (resolver: any, roles: string[] = []) =>
  async (parent: any, args: any, context: any, info: any) => {
    try {
      const token = context.req.headers.authorization?.split(" ")[1]; // Extract Bearer token

      if (!token) throw new Error("Not authenticated! Token missing.");

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      context.user = decoded; // Attach user data to context

      // // If roles are specified, check if the user has at least one of them
      // if (roles.length > 0 && !roles.includes(decoded.role as string)) {
      //   throw new Error("Unauthorized. Insufficient permissions.");
      // }

      return resolver(parent, args, context, info); // Call the original resolver
    } catch (error) {
      throw new Error("Unauthorized. Invalid or missing token.");
    }
  };
