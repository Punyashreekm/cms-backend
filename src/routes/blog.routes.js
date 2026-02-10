const express = require("express");
const {
  createBlogHandler,
  listBlogsHandler,
  getBlogBySlugHandler,
  updateBlogHandler,
  deleteBlogHandler
} = require("../controllers/blog.controller");

const router = express.Router();

router.post("/", createBlogHandler);
router.get("/", listBlogsHandler);
router.get("/:slug", getBlogBySlugHandler);
router.put("/:id", updateBlogHandler);
router.delete("/:id", deleteBlogHandler);

module.exports = router;
