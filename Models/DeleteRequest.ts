import mongoose from "mongoose";
import { InferSchemaType } from "mongoose";

const Schema = new mongoose.Schema(
  {
    reason: {
      type: String,
    },
    email: {
      type: String,
    },
    caseId: {
      type: String,
    },
  },
  { timestamps: true }
);

export type DeleteRequestType = Omit<InferSchemaType<typeof Schema>, ""> & {
  _id: mongoose.Types.ObjectId | string;
};

const DeleteRequest =
  mongoose.models.DeleteRequest ||
  mongoose.model<DeleteRequestType>("DeleteRequest", Schema);

export default DeleteRequest;
