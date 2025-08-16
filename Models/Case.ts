import mongoose from "mongoose";
import { InferSchemaType } from "mongoose";

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      default: "",
    },
    story: {
      type: String,
      default: "",
    },

    leftBehind: [String],

    portraitPhoto: {
      type: String,
      default: "",
    },

    additionalAttachments: [String],
    socialMediaLinks: [String],
    location: {
      lat: String,
      lng: String,
    },
    locationName: String,
    causeOfDeath: String,
    circumstances: String,
    perpetrator: String,
    evidenceDescription: String,
    witness_information: String,
    proofOfId: String,
    proofOfDeath: String,
    proofOfDeathGraphic: Boolean,
    additionalEvidence: String,
    additionalEvidenceGraphic: Boolean,
    sourceOfInformation: String,
    newsLinks: [String],
    notes: String,

    date: Date,

    submittedBy: {
      type: String,
      required: true,
    },
    relationshipToVictim: {
      type: String,
      default: "",
    },

    actionTaken: {
      type: String,
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "third_party_review",
        "digital_forensics_review",
        "verified",
      ],
      default: "pending",
    },

    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    // Verification Status

    isVerified: {
      type: Boolean,
      default: false,
    },
    isThirdPartyVerified: {
      type: Boolean,
      default: false,
    },
    isDigitalForensicsVerified: {
      type: Boolean,
      default: false,
    },

    consentAgreed: {
      type: Boolean,
      required: true,
    },

    safetyAcknowledged: {
      type: Boolean,
      required: true,
    },

    userThirdPartyVerified: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userDigitalForensicsVerified: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userModeratorVerified: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedDate: Date,
  },
  { timestamps: true }
);

export type CaseType = Omit<InferSchemaType<typeof Schema>, ""> & {
  _id: mongoose.Types.ObjectId | string;
};

const Case = mongoose.models.Case || mongoose.model<CaseType>("Case", Schema);

export default Case;
