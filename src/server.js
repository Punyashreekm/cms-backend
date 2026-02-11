require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./config/db");
const blogRoutes = require("./routes/blog.routes");
const heroRoutes = require("./routes/hero.routes");
const { errorHandler } = require("./middlewares/error.middleware");
const { generateSitemap } = require("./controllers/blog.controller");

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/sitemap.xml", generateSitemap);
app.use("/api/blogs", blogRoutes);
app.use("/api/hero", heroRoutes);

const serveFrontend = process.env.SERVE_FRONTEND === "true";
if (serveFrontend) {
  const publicRoot = path.resolve(__dirname, "../../frontend/out");
  const adminRoot = path.resolve(__dirname, "../../admin/out");

  app.use(express.static(publicRoot));
  app.use("/admin", express.static(adminRoot));

  app.get("/admin/*", (req, res) => {
    res.sendFile(path.join(adminRoot, "index.html"));
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(publicRoot, "index.html"));
  });
}

app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
