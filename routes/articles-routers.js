const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles-controllers");
const {
  getCommentsById,
  postCommentById,
} = require("../controllers/comments-controllers");

// /api/articles
articlesRouter.get("/", getArticles);

// /api/articles/:article_id
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

// /api/articles/:article_id/comments
articlesRouter.route("/:article_id/comments").get(getCommentsById).post(postCommentById);

module.exports = articlesRouter;
