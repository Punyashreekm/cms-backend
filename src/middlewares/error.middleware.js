const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate key error" });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

module.exports = { errorHandler };
