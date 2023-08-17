const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles-controllers");
const {
  getCommentsById,
  postCommentById,
} = require("../controllers/comments-controllers");

// /api/articles
articlesRouter.route("/").get(getArticles).post(postArticle);

// /api/articles/:article_id
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

// /api/articles/:article_id/comments
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postCommentById);

module.exports = articlesRouter;
