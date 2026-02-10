const express = require("express");
const {
  createSlideHandler,
  listSlidesHandler,
  updateSlideHandler,
  deleteSlideHandler
} = require("../controllers/hero.controller");

const router = express.Router();

router.post("/", createSlideHandler);
router.get("/", listSlidesHandler);
router.put("/:id", updateSlideHandler);
router.delete("/:id", deleteSlideHandler);

module.exports = router;
