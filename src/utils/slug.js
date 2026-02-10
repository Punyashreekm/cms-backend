const slugify = require("slugify");

async function generateUniqueSlug(title, Model) {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  let slug = base || "item";
  let counter = 1;

  while (await Model.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

module.exports = { generateUniqueSlug };
