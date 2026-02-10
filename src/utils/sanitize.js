function sanitizeHtml(input) {
  if (!input) return "";
  const withoutScripts = input.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  return withoutScripts.trim();
}

module.exports = { sanitizeHtml };
