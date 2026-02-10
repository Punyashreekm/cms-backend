const mongoose = require("mongoose");

const HeroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    mediaUrl: { type: String, required: true, trim: true },
    ctaText: { type: String, trim: true },
    ctaLink: { type: String, trim: true },
    order: { type: Number, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

HeroSlideSchema.index({ order: 1 });

module.exports = mongoose.model("HeroSlide", HeroSlideSchema);
