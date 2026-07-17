import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Suggestion", "Bug Report", "Compliment"], required: true },
    subject: { type: String, required: true, maxlength: 150 },
    message: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
