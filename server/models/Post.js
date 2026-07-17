import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    images: [{ type: String }], // Cloudinary URLs

    price: { type: Number, required: true, min: 0 },
    negotiable: { type: Boolean, default: true },

    category: {
      type: String,
      required: true,
      enum: [
        "Mobile Phones",
        "Laptops",
        "Cameras",
        "Audio",
        "Gaming",
        "TV & Monitors",
        "Accessories",
        "Wearables",
        "Home Appliances",
        "Other",
      ],
    },

    condition: {
      type: String,
      required: true,
      enum: ["Brand New", "Like New", "Good", "Fair", "For Parts"],
    },

    location: { type: String, required: true },

    status: {
      type: String,
      enum: ["available", "reserved", "sold"],
      default: "available",
    },

    // Engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Post", postSchema);
