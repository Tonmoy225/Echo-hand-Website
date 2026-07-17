import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    reason: {
      type: String,
      enum: [
        "Scam / Fraud",
        "Fake Listing",
        "Inappropriate Content",
        "Stolen Item",
        "Harassment",
        "App / Technical Bug",
        "Other",
      ],
      required: true,
    },

    details: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
