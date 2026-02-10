const { z } = require("zod");

const heroCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  mediaUrl: z.string().url(),
  ctaText: z.string().optional(),
  ctaLink: z.string().url().optional(),
  order: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional()
});

const heroUpdateSchema = heroCreateSchema.partial();

module.exports = { heroCreateSchema, heroUpdateSchema };
