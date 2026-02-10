const { z } = require("zod");

const statusEnum = z.enum(["draft", "published"]);

const blogCreateSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  metaTitle: z.string().min(3).optional(),
  metaDescription: z.string().min(10).optional(),
  featuredImage: z.string().url().optional(),
  status: statusEnum.optional()
});

const blogUpdateSchema = blogCreateSchema.partial();

module.exports = { blogCreateSchema, blogUpdateSchema };
