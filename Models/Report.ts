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
  contact_info: {
    type: String,
  },
  message: {
    type: String,
    required: [true, "Please provide your message"],
  },

  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: [true, "Please provide the case ID"],
  },

  type: [String],
});

export type ReportType = Omit<InferSchemaType<typeof Schema>, ""> & {
  _id: mongoose.Types.ObjectId | string;
};

const Report =
  mongoose.models.Report || mongoose.model<ReportType>("Report", Schema);

export default Report;
