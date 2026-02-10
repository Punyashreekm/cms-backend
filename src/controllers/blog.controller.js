const {
  createBlog,
  listBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  listPublishedSlugs
} = require("../services/blog.service");
const { blogCreateSchema, blogUpdateSchema } = require("../validations/blog.schema");

async function createBlogHandler(req, res, next) {
  try {
    const payload = blogCreateSchema.parse(req.body);
    const blog = await createBlog(payload);
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
}

async function listBlogsHandler(req, res, next) {
  try {
    const { page, limit, includeDrafts } = req.query;
    const data = await listBlogs({
      page,
      limit,
      includeDrafts: includeDrafts === "true"
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getBlogBySlugHandler(req, res, next) {
  try {
    const { slug } = req.params;
    const includeDrafts = req.query.includeDrafts === "true";
    const blog = await getBlogBySlug(slug, includeDrafts);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
}

async function updateBlogHandler(req, res, next) {
  try {
    const payload = blogUpdateSchema.parse(req.body);
    const blog = await updateBlog(req.params.id, payload);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
}

async function deleteBlogHandler(req, res, next) {
  try {
    const blog = await deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted" });
  } catch (error) {
    next(error);
  }
}

async function generateSitemap(req, res, next) {
  try {
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    const posts = await listPublishedSlugs();

    const urls = posts
      .map((post) => {
        const lastmod = post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : new Date().toISOString();
        return `\n  <url>\n    <loc>${siteUrl}/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBlogHandler,
  listBlogsHandler,
  getBlogBySlugHandler,
  updateBlogHandler,
  deleteBlogHandler,
  generateSitemap
};
