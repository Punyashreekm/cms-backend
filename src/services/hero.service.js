const HeroSlide = require("../models/HeroSlide");

async function createSlide(payload) {
  return HeroSlide.create(payload);
}

async function listSlides({ includeInactive = false }) {
  const filter = includeInactive ? {} : { isActive: true };
  return HeroSlide.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .lean();
}

async function updateSlide(id, payload) {
  return HeroSlide.findByIdAndUpdate(id, payload, { new: true });
}

async function deleteSlide(id) {
  return HeroSlide.findByIdAndDelete(id);
}

module.exports = {
  createSlide,
  listSlides,
  updateSlide,
  deleteSlide
};
