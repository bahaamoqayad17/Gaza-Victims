import mongoose from "mongoose";
import { InferSchemaType } from "mongoose";

const Schema = new mongoose.Schema(
  {
    note: {
      type: String,
    },
    files: [String],
    caseId: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export type InformationType = Omit<InferSchemaType<typeof Schema>, ""> & {
  _id: mongoose.Types.ObjectId | string;
};

const Information =
  mongoose.models.Information ||
  mongoose.model<InformationType>("Information", Schema);

export default Information;
