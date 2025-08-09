import mongoose from "mongoose";
import { InferSchemaType } from "mongoose";

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
  },
  mobile_number: {
    type: String,
    required: [true, "Please provide your mobile number"],
  },
  message: {
    type: String,
    required: [true, "Please provide your message"],
  },
  type: String,
});

export type ContactType = Omit<InferSchemaType<typeof Schema>, ""> & {
  _id: mongoose.Types.ObjectId | string;
};

const Contact =
  mongoose.models.Contact || mongoose.model<ContactType>("Contact", Schema);

export default Contact;
