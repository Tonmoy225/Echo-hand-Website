import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 200 },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },

    // Social account links
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },

    // Relations
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    cart: [
      {
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    ecoScore: { type: Number, default: 0 }, // gamified eco-impact points
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password automatically when converting to JSON
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
