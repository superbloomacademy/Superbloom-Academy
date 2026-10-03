import Article from "../models/Article.js";

const fields = ["title", "slug", "category", "description", "body", "status"];

const slugify = (s = "") =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const clean = (body) => {
  const data = Object.fromEntries(fields.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));
  // a partial update (for example only the status) keeps the existing slug
  if (data.slug || data.title) data.slug = slugify(data.slug || data.title);
  return data;
};

const fail = (err, res, next) => {
  if (err.code === 11000) return res.status(400).json({ message: "Another article already uses this URL name (slug)." });
  if (err.name === "ValidationError") err.status = 400;
  next(err);
};

/* ---------- public ---------- */

export const listPublicArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ status: "published" }).select("-body").sort({ publishedAt: -1 });
    res.json({ articles });
  } catch (err) {
    next(err);
  }
};

export const getPublicArticle = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: "published" });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ article });
  } catch (err) {
    next(err);
  }
};

/* ---------- admin ---------- */

export const listArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const data = clean(req.body);
    if (data.status === "published") data.publishedAt = new Date();
    const article = await Article.create(data);
    res.status(201).json({ article });
  } catch (err) {
    fail(err, res, next);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    Object.assign(article, clean(req.body));
    // keep the original date when an already published article is edited
    if (article.status === "published" && !article.publishedAt) article.publishedAt = new Date();
    await article.save();
    res.json({ article });
  } catch (err) {
    fail(err, res, next);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    next(err);
  }
};
