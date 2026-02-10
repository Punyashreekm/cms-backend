const Blog = require("../models/Blog");
const { generateUniqueSlug } = require("../utils/slug");
const { sanitizeHtml } = require("../utils/sanitize");
const slugify = require("slugify");

async function createBlog(payload) {
  const slug = await generateUniqueSlug(payload.title, Blog);
  const content = sanitizeHtml(payload.content);
  const blog = await Blog.create({ ...payload, slug, content });
  return blog;
}

async function listBlogs({ page = 1, limit = 10, includeDrafts = false }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const safePage = Math.max(Number(page) || 1, 1);
  const filter = includeDrafts ? {} : { status: "published" };

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .select("title slug metaTitle metaDescription featuredImage status createdAt")
      .lean(),
    Blog.countDocuments(filter)
  ]);

  return {
    data: items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total
    }
  };
}

async function getBlogBySlug(slug, includeDrafts = false) {
  const filter = includeDrafts ? { slug } : { slug, status: "published" };
  return Blog.findOne(filter).lean();
}

async function updateBlog(id, payload) {
  const update = { ...payload };
  if (payload.content) {
    update.content = sanitizeHtml(payload.content);
  }

  if (payload.title) {
    const base = slugify(payload.title, { lower: true, strict: true, trim: true });
    let slug = base || "item";
    let counter = 1;
    while (await Blog.exists({ slug, _id: { $ne: id } })) {
      slug = `${base}-${counter}`;
      counter += 1;
    }
    update.slug = slug;
  }

  return Blog.findByIdAndUpdate(id, update, { new: true });
}

async function deleteBlog(id) {
  return Blog.findByIdAndDelete(id);
}

async function listPublishedSlugs() {
  return Blog.find({ status: "published" })
    .select("slug updatedAt")
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = {
  createBlog,
  listBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  listPublishedSlugs
};
