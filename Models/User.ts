import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { InferSchemaType } from "mongoose";

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    default: "user", // user , admin, senior_moderator, moderator, digital_forensics_moderator, third_party_moderator
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el: any) {
        return el === (this as any).password;
      },
      message: "Passwords are not the same!",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  secondaryEmail: {
    type: String,
    default: null,
  },
  mobile_number: {
    type: String,
    default: null,
  },
  timezone: {
    type: String,
    default: "UTC",
  },
  organization_name: String,
  department: String,
  start_date: Date,
  end_date: Date,
  specializations: [String],
  languages: [String],
  security_clearance: String,

  notes: String,
  contact_name: String,
  contact_number: String,
  contact_email: String,
  contact_relationship: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordResetOTP: String,
  passwordResetOTPExpires: Date,
});
Schema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = "";
  next();
});

Schema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

Schema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export type UserType = Omit<InferSchemaType<typeof Schema>, ""> & {
  _id: mongoose.Types.ObjectId | string;
};

const User = mongoose.models.User || mongoose.model<UserType>("User", Schema);

export default User;
