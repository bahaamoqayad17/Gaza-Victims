import { Request, Response, NextFunction } from "express";

// Validation middleware for user registration
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Check required fields
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide name, email, password, and passwordConfirm",
    });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid email address",
    });
  }

  // Check password length
  if (password.length < 8) {
    return res.status(400).json({
      status: "fail",
      message: "Password must be at least 8 characters long",
    });
  }

  // Check password confirmation
  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords do not match",
    });
  }

  next();
};

// Validation middleware for user login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  next();
};

// Validation middleware for case creation
export const validateCaseCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, age, gender, submittedBy, consentAgreed, safetyAcknowledged } =
    req.body;

  // Check required fields
  if (!name || !age || !gender || !submittedBy) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide name, age, gender, and submittedBy",
    });
  }

  // Check consent and safety acknowledgment
  if (!consentAgreed || !safetyAcknowledged) {
    return res.status(400).json({
      status: "fail",
      message: "Consent and safety acknowledgment are required",
    });
  }

  // Validate age
  if (age < 0 || age > 150) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid age",
    });
  }

  next();
};

// Validation middleware for forgot password
export const validateForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email address",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid email address",
    });
  }

  next();
};

// Validation middleware for OTP verification
export const validateOTPVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and OTP",
    });
  }

  if (otp.length !== 4) {
    return res.status(400).json({
      status: "fail",
      message: "OTP must be 4 digits",
    });
  }

  next();
};

// Validation middleware for password reset
export const validatePasswordReset = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, passwordConfirm } = req.body;

  if (!email || !password || !passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email, password, and passwordConfirm",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: "fail",
      message: "Password must be at least 8 characters long",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords do not match",
    });
  }

  next();
};

// Validation middleware for contact creation
export const validateContactCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, mobile_number, message } = req.body;

  // Check required fields
  if (!name || !email || !mobile_number || !message) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide name, email, mobile_number, and message",
    });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid email address",
    });
  }

  // Check mobile number format (basic validation)
  const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!mobileRegex.test(mobile_number.replace(/[\s\-\(\)]/g, ""))) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid mobile number",
    });
  }

  // Check message length
  if (message.length < 10) {
    return res.status(400).json({
      status: "fail",
      message: "Message must be at least 10 characters long",
    });
  }

  // Check name length
  if (name.length < 2) {
    return res.status(400).json({
      status: "fail",
      message: "Name must be at least 2 characters long",
    });
  }

  next();
};

export const validateReportCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, message, report_type, urgency } = req.body;

  if (!name || !email || !message || !report_type || !urgency) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide name, email, message, report_type, and urgency",
    });
  }

  next();
};
