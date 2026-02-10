const {
  createSlide,
  listSlides,
  updateSlide,
  deleteSlide
} = require("../services/hero.service");
const { heroCreateSchema, heroUpdateSchema } = require("../validations/hero.schema");

async function createSlideHandler(req, res, next) {
  try {
    const payload = heroCreateSchema.parse(req.body);
    const slide = await createSlide(payload);
    res.status(201).json(slide);
  } catch (error) {
    next(error);
  }
}

async function listSlidesHandler(req, res, next) {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const slides = await listSlides({ includeInactive });
    res.json(slides);
  } catch (error) {
    next(error);
  }
}

async function updateSlideHandler(req, res, next) {
  try {
    const payload = heroUpdateSchema.parse(req.body);
    const slide = await updateSlide(req.params.id, payload);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json(slide);
  } catch (error) {
    next(error);
  }
}

async function deleteSlideHandler(req, res, next) {
  try {
    const slide = await deleteSlide(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json({ message: "Slide deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSlideHandler,
  listSlidesHandler,
  updateSlideHandler,
  deleteSlideHandler
};
