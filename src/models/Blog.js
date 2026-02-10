const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    featuredImage: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true },
);

BlogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Blogs", BlogSchema);
